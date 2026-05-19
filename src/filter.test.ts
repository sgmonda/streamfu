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

Deno.test("filter() chunk index", async ({ step }) => {
  await step("predicate receives chunk index 0..N-1", async () => {
    const seen: number[] = []
    const stream = filter(createReadable(["a", "b", "c", "d"]), (_, i) => {
      seen.push(i)
      return true
    })
    assertEquals(await list(stream), ["a", "b", "c", "d"])
    assertEquals(seen, [0, 1, 2, 3])
  })

  await step("predicate can filter by index", async () => {
    const stream = filter(createReadable([10, 20, 30, 40, 50]), (_, i) => i % 2 === 0)
    assertEquals(await list(stream), [10, 30, 50])
  })

  await step("predicate can mix chunk and index", async () => {
    const stream = filter(createReadable([10, 20, 30, 40, 50]), (chunk, i) => chunk > 10 && i < 3)
    assertEquals(await list(stream), [20, 30])
  })
})

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
