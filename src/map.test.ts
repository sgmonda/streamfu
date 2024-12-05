import { assertEquals } from "asserts"
import { map } from "./map.ts"
import { createReadable } from "./createReadable.ts"
import { reduce } from "./reduce.ts"

const TEST_CASES = [{
  title: "double a list of numbers",
  conditions: {
    iterable: [1, 2, 3],
    transform: (item: number) => item * 2,
  },
  expected: [2, 4, 6],
}, {
  title: "parse a list of strings to numbers",
  conditions: {
    iterable: ["1", "2", "3"],
    transform: parseInt,
  },
  expected: [1, 2, 3],
}, {
  title: "transform a list of strings to uppercase",
  conditions: {
    iterable: ["one", "two", "three"],
    transform: (item: string) => item.toUpperCase(),
  },
  expected: ["ONE", "TWO", "THREE"],
}, {
  title: "transform a list of strings to their length",
  conditions: {
    iterable: ["one", "two", "three"],
    transform: (item: string) => item.length,
  },
  expected: [3, 3, 5],
}]

Deno.test("map()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[number]) {
    const { iterable, transform } = conditions
    await step(title, async () => {
      const readable = createReadable(iterable)
      const transformer = map(transform as (item: unknown) => unknown)
      const stream = readable.pipeThrough(transformer)
      const observed = await reduce(stream, (acc: unknown[], chunk: unknown) => [...acc, chunk], [])
      assertEquals(observed, expected)
    })
  }
})
