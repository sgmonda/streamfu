import { assertEquals } from "asserts/equals"
import { assertRejects } from "asserts/rejects"
import { createReadable } from "./createReadable.ts"
import { withs } from "./withs.ts"
import { list } from "./list.ts"

const ERROR_CASES = [
  {
    title: "empty stream",
    given: {
      data: [],
      index: 8,
      value: 0,
    },
    expected: {
      class: RangeError,
      msg: "Invalid index : 8",
    },
  },
  {
    title: "empty stream",
    given: {
      data: [1, 2, 3],
      index: 4,
      value: 0,
    },
    expected: {
      class: RangeError,
      msg: "Invalid index : 4",
    },
  },
]

const OK_CASES = [
  {
    title: "empty stream, index 0",
    given: {
      data: [],
      index: 0,
      value: "hi",
    },
    expected: ["hi"],
  },
  {
    title: "single element stream, index 0",
    given: {
      data: ["hi"],
      index: 0,
      value: "bye",
    },
    expected: ["bye"],
  },
  {
    title: "single element stream, index 1",
    given: {
      data: ["hi"],
      index: 1,
      value: "bye",
    },
    expected: ["hi", "bye"],
  },
  // {
  //   title: "single element stream, index -1",
  //   given: {
  //     data: [1],
  //     index: -1,
  //     value: "hi",
  //   },
  //   expected: [1, "hi"],
  // },
  {
    title: "multiple elements stream, index 0",
    given: {
      data: [1, 2, 3],
      index: 0,
      value: "hi",
    },
    expected: ["hi", 2, 3],
  },
  {
    title: "multiple elements stream, index 1",
    given: {
      data: [1, 2, 3],
      index: 1,
      value: "hi",
    },
    expected: [1, "hi", 3],
  },
  {
    title: "multiple elements stream, index 2",
    given: {
      data: [1, 2, 3],
      index: 2,
      value: "hi",
    },
    expected: [1, 2, "hi"],
  },
  // {
  //   title: "multiple elements stream, index -1",
  //   given: {
  //     data: [1, 2, 3],
  //     index: -1,
  //     value: "hi",
  //   },
  //   expected: [1, 2, 3, "hi"],
  // },
  // {
  //   title: "multiple elements stream, index -2",
  //   given: {
  //     data: [1, 2, 3],
  //     index: -2,
  //     value: "hi",
  //   },
  //   expected: [1, 2, "hi", 3],
  // },
  // {
  //   title: "multiple elements stream, index -3",
  //   given: {
  //     data: [1, 2, 3],
  //     index: -3,
  //     value: "hi",
  //   },
  //   expected: ["hi", 1, 2, 3],
  // },
  // {
  //   title: "multiple elements stream, index -4",
  //   given: {
  //     data: [1, 2, 3],
  //     index: -4,
  //     value: "hi",
  //   },
  //   expected: ["hi", 1, 2, 3],
  // },
]

Deno.test("withs()", async ({ step }) => {
  for (const { title, given, expected } of OK_CASES) {
    await step(title, async () => {
      const readable = createReadable(given.data)
      const withStream = withs<unknown>(readable, given.index, given.value)
      const observed = await list(withStream)
      assertEquals(observed, expected)
    })
  }

  for (const { title, given, expected } of ERROR_CASES) {
    await step(title, async () => {
      const readable = createReadable(given.data)
      const stream = withs(readable, given.index, given.value)
      await assertRejects(() => list(stream), expected.class, expected.msg)
    })
  }
})
