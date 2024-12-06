import { describe, test } from "node:test"
import assert from "node:assert"
import * as streamfu from "../../mod"

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
    const filtered = readable.pipeThrough(streamfu.filter((chunk) => chunk % 2 === 0))
    const reader = filtered.getReader()
    const items = [
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
    ]
    assert.deepStrictEqual(items, [2, undefined, undefined])
  })
})
