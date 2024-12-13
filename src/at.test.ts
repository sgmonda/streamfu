import { createReadable } from "./createReadable.ts"
import { at } from "./at.ts"
import { assertEquals } from "asserts/equals"
import { list } from "./list.ts"
import { range } from "./generators/range.ts"

const TEST_CASES = [{
  title: "empty streams",
  conditions: {
    data: [],
    index: 3,
  },
  expected: undefined,
}, {
  title: "one item",
  conditions: {
    data: [1],
    index: 0,
  },
  expected: 1,
}, {
  title: "two items",
  conditions: {
    data: [1, 2],
    index: 1,
  },
  expected: 2,
}, {
  title: "three items",
  conditions: {
    data: [1, 2, 3],
    index: 2,
  },
  expected: 3,
}, {
  title: "out of bounds",
  conditions: {
    data: [1, 2, 3],
    index: 3,
  },
  expected: undefined,
}, {
  title: "using a range",
  conditions: {
    data: await list(createReadable(range(0, 100))),
    index: 99,
  },
  expected: 99,
}]

Deno.test("at()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = createReadable(conditions.data)
      const observed = await at(readable, conditions.index)
      assertEquals(observed, expected)
    })
  }
})
