import { describe, test } from "node:test"
import assert from "node:assert"
import fs from "node:fs"
import * as streamfu from "../../mod"
import path from "node:path"

describe("createReadable()", () => {
  test("is a function", () => {
    assert.strictEqual(typeof streamfu.createReadable, "function")
  })

  test("returns a ReadableStream", () => {
    const readable = streamfu.createReadable([1, 2, 3])
    assert.ok(readable instanceof ReadableStream)
  })

  test("all iterable items are included as chunks", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    assert.ok(readable instanceof ReadableStream)
    const reader = readable.getReader()
    const items = [
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
    ]
    assert.deepStrictEqual(items, [1, 2, 3, undefined])
  })
})

describe("createWritable()", () => {
  test("is a function", () => {
    assert.strictEqual(typeof streamfu.createWritable, "function")
  })

  test("returns a WritableStream", () => {
    const writable = streamfu.createWritable((chunk) => {})
    assert.ok(writable instanceof WritableStream)
  })

  test("writes chunks to a buffer", async () => {
    const chunks = []
    const writable = streamfu.createWritable((chunk) => chunks.push(chunk))
    const writer = writable.getWriter()
    writer.write(1)
    writer.write(2)
    writer.write(3)
    writer.close()
    await writer.closed
    assert.deepStrictEqual(chunks, [1, 2, 3])
  })
})

describe("map()", () => {
  test("is a function", () => {
    assert.strictEqual(typeof streamfu.map, "function")
  })

  test("maps chunks", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    const mapped = streamfu.map(readable, (chunk) => chunk * 2)
    const reader = mapped.getReader()
    const items = [
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
    ]
    assert.deepStrictEqual(items, [2, 4, 6, undefined])
  })
})

describe("reduce()", () => {
  test("is a function", () => {
    assert.strictEqual(typeof streamfu.reduce, "function")
  })

  test("reduces chunks to a single value", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    const result = await streamfu.reduce(readable, (acc, chunk) => acc + chunk, 0)
    assert.strictEqual(result, 6)
  })
})

describe("filter()", () => {
  test("is a function", () => {
    assert.strictEqual(typeof streamfu.filter, "function")
  })

  test("filters chunks", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    const filtered = streamfu.filter(readable, (chunk) => chunk % 2 === 0)
    const reader = filtered.getReader()
    const items = [
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
    ]
    assert.deepStrictEqual(items, [2, undefined, undefined])
  })
})

describe("mixed", () => {
  test("read file and process rows", async () => {
    const nodeReadable = fs.createReadStream(path.join(".", "countries.csv"), "utf8")
    const ids = streamfu.words(10, 1000)

    // TODO Create a pipe() to simplify the following
    const readable = streamfu.createReadable(nodeReadable)
    const r1 = streamfu.flatMap(readable, (chunk) => chunk.split(/\r\n/))
    const sinheader = streamfu.slice(r1, 1)
    const r1b = streamfu.filter(sinheader, (chunk) => chunk.length > 0)
    const r1c = streamfu.map(r1b, (chunk) => chunk.split(","))

    const r2 = streamfu.zip(ids, r1c)
    const obj = streamfu.map(r2, ([id, row], i) => ({
      num: i + 1,
      id,
      name: row[0],
      population: parseInt(row[2]),
    }))

    const partstream = streamfu.slice(obj, 17, 19)
    const part = await streamfu.list(partstream)
    assert.strictEqual(part[1].num, 19)
    assert.strictEqual(part[1].name, "Belarus ")
    assert.strictEqual(part[1].population, 10293011)
    assert(/\w{5}/.test(part[1].id))
  })
})
