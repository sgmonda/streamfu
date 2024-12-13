import { flat } from "./flat.ts"
import { createReadable } from "./createReadable.ts"
import { list } from "./list.ts"
import { assertEquals } from "asserts/equals"

const TEST_CASES = [{
  title: "empty stream",
  conditions: {
    input: [],
    depth: 1,
  },
  expected: [],
}, {
  title: "flat stream, zero depth",
  conditions: {
    input: [1, 2, 3, 4, 5],
    depth: 0,
  },
  expected: [1, 2, 3, 4, 5],
}, {
  title: "flat stream",
  conditions: {
    input: [1, 2, 3, 4, 5],
    depth: 1,
  },
  expected: [1, 2, 3, 4, 5],
}, {
  title: "nested stream, zero depth",
  conditions: {
    input: [[1, 2], 3, [4, 5, [9], 10]],
    depth: 0,
  },
  expected: [[1, 2], 3, [4, 5, [9], 10]],
}, {
  title: "nested stream, default depth",
  conditions: {
    input: [[1, 2], 3, [4, 5, [9], 10]],
    depth: undefined,
  },
  expected: [1, 2, 3, 4, 5, [9], 10],
}, {
  title: "nested stream, partial depth",
  conditions: {
    input: [[1, 2], 3, [4, 5, [9], 10]],
    depth: 1,
  },
  expected: [1, 2, 3, 4, 5, [9], 10],
}, {
  title: "nested stream, full depth",
  conditions: {
    input: [[1, 2], 3, [4, 5, [9], 10]],
    depth: 2,
  },
  expected: [1, 2, 3, 4, 5, 9, 10],
}, {
  title: "nested stream, infinity depth",
  conditions: {
    input: [[1, 2], 3, [4, 5, [9, [10]], 11]],
    depth: Infinity,
  },
  expected: [1, 2, 3, 4, 5, 9, 10, 11],
}]

Deno.test("flat()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = createReadable(conditions.input)
      const flatten = flat(readable, conditions.depth)
      const observed = await list(flatten)
      assertEquals(observed, expected)
    })
  }
})
