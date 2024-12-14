import { assertEquals } from "asserts/equals"
import { createReadable } from "./createReadable.ts"
import { includes } from "./includes.ts"

const TEST_CASES = [{
  title: "empty stream",
  conditions: {
    collection: [],
    value: 0,
  },
  expected: false,
}, {
  title: "many items including the value",
  conditions: {
    collection: [1, 2, 3, 4, 5],
    value: 3,
  },
  expected: true,
}, {
  title: "many items not including the value",
  conditions: {
    collection: [1, 2, 3, 4, 5, "6"],
    value: 6,
  },
  expected: false,
}]

Deno.test("includes()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = createReadable(conditions.collection)
      const observed = await includes(readable, conditions.value)
      assertEquals(observed, expected)
    })
  }
})
