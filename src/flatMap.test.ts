import { assertEquals } from "asserts/equals"
import { createReadable } from "./createReadable.ts"
import { list } from "./list.ts"
import { flatMap } from "./flatMap.ts"

const TEST_CASES = [{
  title: "empty stream",
  conditions: {
    input: [],
    mapper: (_: unknown) => 0,
  },
  expected: [],
}, {
  title: "flat stream",
  conditions: {
    input: [1, 2, 3, 4, 5],
    mapper: (value: number) => [value, value],
  },
  expected: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
}, {
  title: "nested stream",
  conditions: {
    input: [[1, 2], 3, [4, 5, [9], 10]],
    mapper: (value: number) => [value, value],
  },
  expected: [[1, 2], [1, 2], 3, 3, [4, 5, [9], 10], [4, 5, [9], 10]],
}]

Deno.test("flatMap()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = createReadable(conditions.input)
      // deno-lint-ignore no-explicit-any
      const mapped = flatMap(readable, conditions.mapper as any)
      const observed = await list(mapped)
      assertEquals(observed, expected)
    })
  }
})
