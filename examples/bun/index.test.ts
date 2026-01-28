import { describe, test, expect } from "bun:test"
import fs from "node:fs"
import path from "node:path"
import * as streamfu from "../../mod.ts"

describe("createReadable()", () => {
  test("is a function", () => {
    expect(typeof streamfu.createReadable).toBe("function")
  })

  test("returns a ReadableStream", () => {
    const readable = streamfu.createReadable([1, 2, 3])
    expect(readable).toBeInstanceOf(ReadableStream)
  })

  test("all iterable items are included as chunks", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    expect(readable).toBeInstanceOf(ReadableStream)
    const reader = readable.getReader()
    const items = [
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
    ]
    expect(items).toEqual([1, 2, 3, undefined])
  })
})

describe("createWritable()", () => {
  test("is a function", () => {
    expect(typeof streamfu.createWritable).toBe("function")
  })

  test("returns a WritableStream", () => {
    const writable = streamfu.createWritable((_chunk: unknown) => {})
    expect(writable).toBeInstanceOf(WritableStream)
  })

  test("writes chunks to a buffer", async () => {
    const chunks: number[] = []
    const writable = streamfu.createWritable((chunk: number) => chunks.push(chunk))
    const writer = writable.getWriter()
    writer.write(1)
    writer.write(2)
    writer.write(3)
    writer.close()
    await writer.closed
    expect(chunks).toEqual([1, 2, 3])
  })
})

describe("map()", () => {
  test("is a function", () => {
    expect(typeof streamfu.map).toBe("function")
  })

  test("maps chunks", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    const mapped = streamfu.map(readable, (chunk: number) => chunk * 2)
    const reader = mapped.getReader()
    const items = [
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
    ]
    expect(items).toEqual([2, 4, 6, undefined])
  })
})

describe("reduce()", () => {
  test("is a function", () => {
    expect(typeof streamfu.reduce).toBe("function")
  })

  test("reduces chunks to a single value", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    const result = await streamfu.reduce(readable, (acc: number, chunk: number) => acc + chunk, 0)
    expect(result).toBe(6)
  })
})

describe("filter()", () => {
  test("is a function", () => {
    expect(typeof streamfu.filter).toBe("function")
  })

  test("filters chunks", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    const filtered = streamfu.filter(readable, (chunk: number) => chunk % 2 === 0)
    const reader = filtered.getReader()
    const items = [
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
    ]
    expect(items).toEqual([2, undefined, undefined])
  })
})

describe("mixed", () => {
  test("read file and process rows", async () => {
    const nodeReadable = fs.createReadStream(path.join(".", "countries.csv"), "utf8")
    const ids = streamfu.words(10, 1000)

    const r1c = streamfu.pipe(
      streamfu.createReadable(nodeReadable),
      (r: ReadableStream<string>) => streamfu.flatMap(r, (chunk: string) => chunk.split(/\r?\n/)),
      (r: ReadableStream<string>) => streamfu.slice(r, 1),
      (r: ReadableStream<string>) => streamfu.filter(r, (chunk: string) => chunk.length > 0),
      (r: ReadableStream<string>) => streamfu.map(r, (chunk: string) => chunk.split(",")),
    )

    const partstream = streamfu.pipe(
      streamfu.zip(ids, r1c),
      (r: ReadableStream<[string, string[]]>) =>
        streamfu.map(r, ([id, row]: [string, string[]], i: number) => ({
          num: i + 1,
          id,
          name: row[0],
          population: parseInt(row[2]),
        })),
      (r: ReadableStream<{ num: number; id: string; name: string; population: number }>) => streamfu.slice(r, 17, 19),
    )

    const part = await streamfu.list(partstream)
    expect(part[1].num).toBe(19)
    expect(part[1].name).toBe("Belarus ")
    expect(part[1].population).toBe(10293011)
    expect(/\w{5}/.test(part[1].id)).toBe(true)
  })
})
