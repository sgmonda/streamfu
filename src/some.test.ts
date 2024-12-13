import { assertEquals } from "asserts/equals"
import { createReadable } from "./createReadable.ts"
import { some } from "./some.ts"

const TEST_CASES = [{
  title: "empty streams",
  conditions: {
    data: [],
    predicate: () => false,
  },
  expected: false,
}, {
  title: "some positive",
  conditions: {
    data: [1, 2, -3],
    predicate: (chunk: number) => chunk > 0,
  },
  expected: true,
}, {
  title: "no positive",
  conditions: {
    data: [-1, -2, -3],
    predicate: (chunk: number) => chunk > 0,
  },
  expected: false,
}, {
  title: "some even",
  conditions: {
    data: [1, 2, 3],
    predicate: (chunk: number) => chunk % 2 === 0,
  },
  expected: true,
}, {
  title: "no even",
  conditions: {
    data: [1, 3, 5],
    predicate: (chunk: number) => chunk % 2 === 0,
  },
  expected: false,
}, {
  title: "some arrays",
  conditions: {
    data: [[], [1], 2],
    predicate: (chunk: number[]) => Array.isArray(chunk),
  },
  expected: true,
}, {
  title: "no arrays",
  conditions: {
    data: ["a", 1, 2],
    predicate: (chunk: number[]) => Array.isArray(chunk),
  },
  expected: false,
}]

Deno.test("every()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = createReadable(conditions.data)
      // deno-lint-ignore no-explicit-any
      const observed = await some<any>(readable, conditions.predicate)
      assertEquals(observed, expected)
    })
  }
})
