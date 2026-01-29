import { describe, expect, test } from "bun:test"
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
    const items = await streamfu.list(readable)
    expect(items).toEqual([1, 2, 3])
  })
})

describe("createWritable()", () => {
  test("is a function", () => {
    expect(typeof streamfu.createWritable).toBe("function")
  })

  test("returns a WritableStream", () => {
    const writable = streamfu.createWritable(() => {})
    expect(writable).toBeInstanceOf(WritableStream)
  })

  test("writes chunks to a buffer", async () => {
    const chunks: number[] = []
    const writable = streamfu.createWritable((chunk: number) => {
      chunks.push(chunk)
    })
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
    const items = await streamfu.list(mapped)
    expect(items).toEqual([2, 4, 6])
  })
})

describe("reduce()", () => {
  test("is a function", () => {
    expect(typeof streamfu.reduce).toBe("function")
  })

  test("reduces chunks to a single value", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    const result = await streamfu.reduce(readable, (acc, chunk) => acc + chunk, 0)
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
    const items = await streamfu.list(filtered)
    expect(items).toEqual([2])
  })
})
