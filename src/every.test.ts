import { assertEquals, assertRejects } from "asserts"
import { createReadable } from "./createReadable.ts"
import { every } from "./every.ts"

const TEST_CASES = [{
  title: "empty streams",
  conditions: {
    data: [],
    predicate: () => false,
  },
  expected: true,
}, {
  title: "all positive",
  conditions: {
    data: [1, 2, 3],
    predicate: (chunk: number) => chunk > 0,
  },
  expected: true,
}, {
  title: "not all positive",
  conditions: {
    data: [1, 2, -3],
    predicate: (chunk: number) => chunk > 0,
  },
  expected: false,
}, {
  title: "all even",
  conditions: {
    data: [2, 4, 6],
    predicate: (chunk: number) => chunk % 2 === 0,
  },
  expected: true,
}, {
  title: "not all even",
  conditions: {
    data: [2, 4, 5],
    predicate: (chunk: number) => chunk % 2 === 0,
  },
  expected: false,
}, {
  title: "all arrays",
  conditions: {
    data: [[], [1], [1, 2]],
    predicate: (chunk: number[]) => Array.isArray(chunk),
  },
  expected: true,
}, {
  title: "not all arrays",
  conditions: {
    data: [[], [1], 2],
    predicate: (chunk: number[]) => Array.isArray(chunk),
  },
  expected: false,
}]

Deno.test("every() error propagation", async ({ step }) => {
  await step("error in predicate rejects the promise", async () => {
    const readable = createReadable([1, 2, 3])
    await assertRejects(
      () =>
        every(readable, (chunk) => {
          if (chunk === 2) throw new Error("predicate error")
          return chunk > 0
        }),
      Error,
      "predicate error",
    )
  })
})

Deno.test("every()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = createReadable(conditions.data)
      // deno-lint-ignore no-explicit-any
      const observed = await every<any>(readable, conditions.predicate)
      assertEquals(observed, expected)
    })
  }
})
