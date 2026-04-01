import { assertEquals, assertRejects } from "asserts"
import { createReadable } from "./createReadable.ts"
import { filter } from "./filter.ts"
import { flatMap } from "./flatMap.ts"
import { list } from "./list.ts"
import { map } from "./map.ts"
import { pipe } from "./pipe.ts"
import { slice } from "./slice.ts"

Deno.test("pipe() type inference", async ({ step }) => {
  await step("single function: infers input from stream and output from return type", async () => {
    const result: ReadableStream<string> = pipe(
      createReadable([1, 2, 3]),
      (r) => map(r, (chunk) => chunk.toFixed(2)),
    )
    // @ts-expect-error: ReadableStream<string> is not assignable to ReadableStream<number>
    const _negative: ReadableStream<number> = pipe(
      createReadable([1, 2, 3]),
      (r) => map(r, (chunk) => chunk.toFixed(2)),
    )
    assertEquals(await list(result), ["1.00", "2.00", "3.00"])
  })

  await step("two functions: chains types through pipeline", async () => {
    const result: ReadableStream<string> = pipe(
      createReadable([1, 2, 3, 4]),
      (r) => filter(r, (chunk) => chunk % 2 === 0),
      (r) => map(r, (chunk) => `(${chunk})`),
    )
    // @ts-expect-error: ReadableStream<string> is not assignable to ReadableStream<number>
    const _negative: ReadableStream<number> = pipe(
      createReadable([1, 2, 3, 4]),
      (r) => filter(r, (chunk) => chunk % 2 === 0),
      (r) => map(r, (chunk) => `(${chunk})`),
    )
    assertEquals(await list(result), ["(2)", "(4)"])
  })

  await step("four functions: full chain inference across types", async () => {
    const result: ReadableStream<string> = pipe(
      createReadable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      (r) => flatMap(r, (chunk) => [chunk, chunk]),
      (r) => slice(r, 2),
      (r) => filter(r, (chunk) => chunk < 4),
      (r) => map(r, (chunk) => `(${chunk})`),
    )
    // @ts-expect-error: ReadableStream<string> is not assignable to ReadableStream<number>
    const _negative: ReadableStream<number> = pipe(
      createReadable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      (r) => flatMap(r, (chunk) => [chunk, chunk]),
      (r) => slice(r, 2),
      (r) => filter(r, (chunk) => chunk < 4),
      (r) => map(r, (chunk) => `(${chunk})`),
    )
    assertEquals(await list(result), ["(2)", "(2)", "(3)", "(3)"])
  })
})

Deno.test("pipe() error propagation", async ({ step }) => {
  await step("error in a piped transform rejects the consuming promise", async () => {
    const stream = pipe(
      createReadable([1, 2, 3]),
      (r) =>
        map(r, (chunk) => {
          if (chunk === 2) throw new Error("pipe error")
          return chunk
        }),
      (r) => filter(r, (chunk) => chunk > 0),
    )
    await assertRejects(
      () => list(stream),
      Error,
      "pipe error",
    )
  })
})

Deno.test("pipe()", async () => {
  const stream = pipe(
    createReadable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    (r) => flatMap(r, (chunk) => [chunk, chunk]),
    (r) => slice(r, 2),
    (r) => filter(r, (chunk) => chunk < 4),
    (r) => map(r, (chunk) => `(${chunk})`),
  )
  const observed = await list(stream)
  assertEquals(observed, ["(2)", "(2)", "(3)", "(3)"])
})
