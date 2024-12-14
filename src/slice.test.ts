import { assertEquals } from "asserts/equals"
import { createReadable } from "./createReadable.ts"
import { list } from "./list.ts"
import { slice } from "./slice.ts"

const TEST_CASES = [{
  title: "empty stream",
  conditions: {
    data: [],
    start: 0,
    end: 0,
  },
  expected: [],
}, {
  title: "one item",
  conditions: {
    data: [1],
    start: 0,
    end: 1,
  },
  expected: [1],
}, {
  title: "two items",
  conditions: {
    data: [1, 2],
    start: 0,
    end: 1,
  },
  expected: [1],
}, {
  title: "two items. start at 1",
  conditions: {
    data: [1, 2],
    start: 1,
    end: 2,
  },
  expected: [2],
}, {
  title: "three items",
  conditions: {
    data: [1, 2, 3],
    start: 0,
    end: 2,
  },
  expected: [1, 2],
}, {
  title: "three items. start at 1",
  conditions: {
    data: [1, 2, 3],
    start: 1,
    end: 3,
  },
  expected: [2, 3],
}, {
  title: "three items. start at 1, end at 2",
  conditions: {
    data: [1, 2, 3],
    start: 1,
    end: 2,
  },
  expected: [2],
}, {
  title: "three items. start at 2",
  conditions: {
    data: [1, 2, 3],
    start: 2,
    end: 3,
  },
  expected: [3],
}, {
  title: "three items. start at 3",
  conditions: {
    data: [1, 2, 3],
    start: 3,
    end: 3,
  },
  expected: [],
}, {
  title: "three items. start at 4",
  conditions: {
    data: [1, 2, 3],
    start: 4,
    end: 4,
  },
  expected: [],
}, {
  title: "everything but first item",
  conditions: {
    data: [1, 2, 3],
    start: 1,
    end: undefined,
  },
  expected: [2, 3],
}]

Deno.test("slice()", async ({ step }) => {
  for (const testCase of TEST_CASES) {
    await runTest(testCase)
  }

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = createReadable(conditions.data)
      const sliced = slice(readable, conditions.start, conditions.end)
      const observed = await list(sliced)
      assertEquals(observed, expected)
    })
  }
})
