import { assertEquals, assertRejects } from "asserts"
import { createReadable } from "./createReadable.ts"
import { filter } from "./filter.ts"
import { list } from "./list.ts"

const TEST_CASES = [{
  title: "filter even numbers",
  conditions: {
    iterable: [1, 2, 3, 4, 5, 6],
    predicate: (item: number) => item % 2 === 0,
  },
  expected: [2, 4, 6],
}, {
  title: "filter strings with length greater than 3",
  conditions: {
    iterable: ["one", "two", "three", "four", "five"],
    predicate: (item: string) => item.length > 3,
  },
  expected: ["three", "four", "five"],
}, {
  title: "filter objects with property 'a' greater than 1",
  conditions: {
    iterable: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }],
    predicate: (item: { a: number }) => item.a > 1,
  },
  expected: [{ a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }],
}]

Deno.test("filter() error propagation", async ({ step }) => {
  await step("sync error in predicate rejects the consuming promise", async () => {
    const readable = createReadable([1, 2, "hello" as unknown as number])
    const filtered = filter(readable, (chunk) => (chunk as number).toFixed(2) !== "0.00")
    await assertRejects(
      () => list(filtered),
      TypeError,
    )
  })

  await step("async error in predicate rejects the consuming promise", async () => {
    const readable = createReadable([1, 2, 3])
    const filtered = filter(readable, (chunk) => {
      if (chunk === 3) throw new Error("bad predicate")
      return chunk > 0
    })
    await assertRejects(
      () => list(filtered),
      Error,
      "bad predicate",
    )
  })
})

Deno.test("filter()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[number]) {
    const { iterable, predicate } = conditions
    await step(title, async () => {
      const readable = createReadable(iterable)
      // deno-lint-ignore no-explicit-any
      const filtered = filter<any>(readable, predicate)
      const observed = await list(filtered)
      assertEquals(observed, expected)
    })
  }
})
