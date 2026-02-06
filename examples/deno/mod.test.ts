import * as streamfu from "../../mod.ts"
import { assert, assertEquals, assertRejects } from "asserts"

Deno.test("createReadable()", async ({ step }) => {
  await step("is a function", () => {
    assertEquals(typeof streamfu.createReadable, "function")
  })

  await step("returns a ReadableStream", () => {
    const readable = streamfu.createReadable([1, 2, 3])
    assert(readable instanceof ReadableStream)
  })

  await step("all iterable items are included as chunks", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    assert(readable instanceof ReadableStream)
    const reader = readable.getReader()
    const items = [
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
    ]
    assertEquals(items, [1, 2, 3, undefined])
  })
})

Deno.test("createWritable()", async ({ step }) => {
  await step("is a function", () => {
    assertEquals(typeof streamfu.createWritable, "function")
  })

  await step("returns a WritableStream", () => {
    const writable = streamfu.createWritable((chunk) => {})
    assert(writable instanceof WritableStream)
  })

  await step("writes chunks to a buffer", async () => {
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
    assertEquals(chunks, [1, 2, 3])
  })
})

Deno.test("map()", async ({ step }) => {
  await step("is a function", () => {
    assertEquals(typeof streamfu.map, "function")
  })

  await step("maps chunks", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    const mapped = streamfu.map(readable, (chunk: number) => chunk * 2)
    const reader = mapped.getReader()
    const items = [
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
    ]
    assertEquals(items, [2, 4, 6, undefined])
  })
})

Deno.test("reduce()", async ({ step }) => {
  await step("is a function", () => {
    assertEquals(typeof streamfu.reduce, "function")
  })

  await step("reduces chunks to a single value", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    const result = await streamfu.reduce(
      readable,
      (acc, chunk) => acc + chunk,
      0,
    )
    assertEquals(result, 6)
  })
})

Deno.test("filter()", async ({ step }) => {
  await step("is a function", () => {
    assertEquals(typeof streamfu.filter, "function")
  })

  await step("filters chunks", async () => {
    const readable = streamfu.createReadable([1, 2, 3])
    const filtered = streamfu.filter(
      readable,
      (chunk: number) => chunk % 2 === 0,
    )
    const reader = filtered.getReader()
    const items = [
      (await reader.read()).value,
      (await reader.read()).value,
      (await reader.read()).value,
    ]
    assertEquals(items, [2, undefined, undefined])
  })
})

Deno.test("Error handling", async ({ step }) => {
  await step("maps chunks", async () => {
    const stream1 = streamfu.createReadable([
      1,
      2,
      3,
      5.552222,
      "hello" as unknown as number,
    ])
    const stream2 = streamfu.map(
      stream1,
      (chunk) => chunk.toFixed(2),
      (chunk) => Number(chunk) / 2,
    )
    const stream3 = streamfu.slice(stream2, 1)
    const stream4 = streamfu.map(
      stream3,
      (chunk) => chunk * 2,
      (piece) => piece.toFixed(2),
    )
    await assertRejects(
      () => streamfu.list(stream4),
      TypeError,
      "chunk.toFixed is not a function",
    )
  })
})
