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
      parseInt,
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
