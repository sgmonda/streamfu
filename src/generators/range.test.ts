import { assertEquals } from "asserts/equals"
import { range } from "./range.ts"
import { list } from "../list.ts"

const TEST_CASES = [{
  title: "default step",
  conditions: { min: 0, max: 4, step: undefined },
  expected: [0, 1, 2, 3, 4],
}, {
  title: "integers with custom step",
  conditions: { min: 0, max: 4, step: 2 },
  expected: [0, 2, 4],
}, {
  title: "float with custom step",
  conditions: { min: 0, max: 8, step: 0.75 },
  expected: [0, 0.75, 1.5, 2.25, 3, 3.75, 4.5, 5.25, 6, 6.75, 7.5],
}, {
  title: "negative step",
  conditions: { min: 4, max: 0, step: -1 },
  expected: [4, 3, 2, 1, 0],
}, {
  title: "not exact end",
  conditions: { min: 0, max: 3, step: 0.8 },
  expected: [0, 0.8, 1.6, 2.4000000000000004], // These weird numbers are due to floating point precision. It is expected in JavaScript.
}]

Deno.test("range()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = range(conditions.min, conditions.max, conditions.step)
      const observed = await list(readable)
      assertEquals(observed, expected)
    })
  }
})
