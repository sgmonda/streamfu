import { assertEquals } from "asserts"
import { map } from "./map.ts"
import { createReadable } from "./createReadable.ts"
import { list } from "./list.ts"

const TEST_CASES = [{
  title: "double a list of numbers",
  conditions: {
    iterable: [1, 2, 3],
    transforms: [
      (item: number) => item * 2,
    ],
  },
  expected: [2, 4, 6],
}, {
  title: "parse a list of strings to numbers",
  conditions: {
    iterable: ["1", "2", "3"],
    transforms: [
      (num: string) => parseInt(num, 10),
    ],
  },
  expected: [1, 2, 3],
}, {
  title: "transform a list of strings to uppercase",
  conditions: {
    iterable: ["one", "two", "three"],
    transforms: [
      (item: string) => item.toUpperCase(),
    ],
  },
  expected: ["ONE", "TWO", "THREE"],
}, {
  title: "transform a list of strings to their length",
  conditions: {
    iterable: ["one", "two", "three"],
    transforms: [
      (item: string) => item.length,
    ],
  },
  expected: [3, 3, 5],
}, {
  title: "many transformations",
  conditions: {
    iterable: ["1", "2", "3"],
    transforms: [
      parseInt,
      (item: number) => item * 2.1299,
      (item: number) => item.toFixed(3),
    ],
  },
  expected: ["2.130", "4.260", "6.390"],
}, {
  title: "remove non-json-serializable items",
  conditions: {
    iterable: [1, "2", 3, () => 23, { four: 4 }, [5]],
    transforms: [
      JSON.stringify,
      (chunk: unknown) => {
        try {
          return JSON.parse(chunk as string)
        } catch (_) {
          return undefined
        }
      },
    ],
  },
  expected: [1, "2", 3, undefined, { four: 4 }, [5]],
}]

Deno.test("map() type inference", async ({ step }) => {
  await step("single transformer: infers input from stream and output from return type", async () => {
    const result: ReadableStream<string> = map(createReadable([1, 2, 3]), (chunk) => chunk.toFixed(2))
    // @ts-expect-error: ReadableStream<string> is not assignable to ReadableStream<number>
    const _negative: ReadableStream<number> = map(createReadable([1, 2, 3]), (chunk) => chunk.toFixed(2))
    assertEquals(await list(result), ["1.00", "2.00", "3.00"])
  })

  await step("two transformers: second input inferred from first output", async () => {
    const result: ReadableStream<string> = map(
      createReadable([1, 2, 3]),
      (chunk) => chunk * 2,
      (piece) => piece.toFixed(2),
    )
    // @ts-expect-error: ReadableStream<string> is not assignable to ReadableStream<number>
    const _negative: ReadableStream<number> = map(
      createReadable([1, 2, 3]),
      (chunk) => chunk * 2,
      (piece) => piece.toFixed(2),
    )
    assertEquals(await list(result), ["2.00", "4.00", "6.00"])
  })

  await step("three transformers: full chain inference across types", async () => {
    const result: ReadableStream<boolean> = map(
      createReadable(["1", "2", "3"]),
      (chunk) => parseInt(chunk, 10),
      (num) => num * 2.5,
      (num) => num > 3,
    )
    // @ts-expect-error: ReadableStream<boolean> is not assignable to ReadableStream<string>
    const _negative: ReadableStream<string> = map(
      createReadable(["1", "2", "3"]),
      (chunk) => parseInt(chunk, 10),
      (num) => num * 2.5,
      (num) => num > 3,
    )
    assertEquals(await list(result), [false, true, true])
  })
})

Deno.test("map()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[number]) {
    const { iterable, transforms } = conditions
    await step(title, async () => {
      const readable = createReadable(iterable)
      const stream = map(readable as ReadableStream, ...transforms as ((chunk: unknown) => unknown)[])
      const observed = await list(stream)
      assertEquals(observed, expected)
    })
  }
})
