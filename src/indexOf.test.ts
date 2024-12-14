import { assertEquals } from "asserts/equals"
import { createReadable } from "./createReadable.ts"
import { indexOf } from "./indexOf.ts"

const TEST_CASES = [{
  title: "empty streams",
  conditions: {
    data: [],
    value: 1,
  },
  expected: -1,
}, {
  title: "many items. found",
  conditions: {
    data: [1, 2, 3, 4, 5],
    value: 3,
  },
  expected: 2,
}, {
  title: "many items. not found",
  conditions: {
    data: [1, 2, 3, 4, 5],
    value: 6,
  },
  expected: -1,
}]

Deno.test("indexOf()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = createReadable(conditions.data)
      const observed = await indexOf(readable, conditions.value)
      assertEquals(observed, expected)
    })
  }
})
