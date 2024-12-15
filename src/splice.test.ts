import { assertEquals } from "asserts/equals"
import { createReadable } from "./createReadable.ts"
import { splice } from "./splice.ts"
import { list } from "./list.ts"

const TEST_CASES = [{
  title: "empty stream",
  conditions: {
    data: [],
    index: 8,
    replaced: 0,
    inserted: [],
  },
  expected: [],
}, {
  title: "single item stream, removing",
  conditions: {
    data: [33],
    index: 0,
    replaced: 1,
    inserted: [],
  },
  expected: [],
}, {
  title: "single item stream, inserting without removing (do nothing)",
  conditions: {
    data: [33],
    index: 0,
    replaced: 0,
    inserted: [44],
  },
  expected: [33],
}, {
  title: "multiple items stream, removing",
  conditions: {
    data: [11, 22, 33, 44, 55],
    index: 2,
    replaced: 1,
    inserted: [],
  },
  expected: [11, 22, 44, 55],
}, {
  title: "multiple items stream, inserting without removing (do nothing)",
  conditions: {
    data: [11, 22, 33, 44, 55],
    index: 2,
    replaced: 0,
    inserted: [66, 77],
  },
  expected: [11, 22, 33, 44, 55],
}, {
  title: "multiple items stream, removing and inserting",
  conditions: {
    data: [11, 22, 33, 44, 55],
    index: 1,
    replaced: 2,
    inserted: [66, 77],
  },
  expected: [11, 66, 77, 44, 55],
}]

Deno.test("splice()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = createReadable(conditions.data)
      const spliced = splice(readable, conditions.index, conditions.replaced, ...conditions.inserted)
      const observed = await list(spliced)
      assertEquals(observed, expected)
    })
  }
})
