import { assertEquals } from "asserts"
import { createReadable } from "./createReadable.ts"
import { reduce } from "./reduce.ts"

const TEST_CASES = [{
  title: "sum a list of numbers",
  conditions: {
    iterable: [1, 2, 3],
    reducer: (accum: number, chunk: number) => accum + chunk,
    initialValue: 0,
  },
  expected: 6,
}, {
  title: "concatenate a list of strings",
  conditions: {
    iterable: ["one", "two", "three"],
    reducer: (accum: string, chunk: string) => accum + chunk,
    initialValue: "",
  },
  expected: "onetwothree",
}, {
  title: "concatenate a list of strings with their position",
  conditions: {
    iterable: ["zero", "one", "two"],
    reducer: (accum: string, chunk: string, index: number) => accum + `${index}:${chunk} `,
    initialValue: "",
  },
  expected: "0:zero 1:one 2:two ",
}, {
  title: "sum a list of numbers from their string representation",
  conditions: {
    iterable: ["2.34", "1.298", "33.003"],
    reducer: (accum: number, chunk: string) => accum + parseFloat(chunk),
    initialValue: 0,
  },
  expected: 36.641,
}]

Deno.test("reduce()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[number]) {
    const { iterable, reducer, initialValue } = conditions
    await step(title, async () => {
      const readable = createReadable(iterable)
      const observed = await reduce(
        readable as ReadableStream,
        reducer as (acc: unknown, chunk: unknown) => unknown,
        initialValue,
      )
      assertEquals(observed, expected)
    })
  }
})
