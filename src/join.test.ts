import { assertEquals } from "asserts/equals"
import { createReadable } from "./createReadable.ts"
import { join } from "./join.ts"

const TEST_CASES = [{
  title: "empty stream with default separator",
  conditions: {
    collection: [] as string[],
    separator: undefined,
  },
  expected: "",
}, {
  title: "single item with default separator",
  conditions: {
    collection: ["hello"],
    separator: undefined,
  },
  expected: "hello",
}, {
  title: "multiple strings with default separator (comma)",
  conditions: {
    collection: ["a", "b", "c"],
    separator: undefined,
  },
  expected: "a,b,c",
}, {
  title: "multiple strings with custom separator",
  conditions: {
    collection: ["hello", "world", "foo"],
    separator: " ",
  },
  expected: "hello world foo",
}, {
  title: "multiple strings with empty separator",
  conditions: {
    collection: ["a", "b", "c"],
    separator: "",
  },
  expected: "abc",
}, {
  title: "multiple strings with multi-char separator",
  conditions: {
    collection: ["one", "two", "three"],
    separator: " - ",
  },
  expected: "one - two - three",
}, {
  title: "numbers are converted to strings",
  conditions: {
    collection: [1, 2, 3],
    separator: ",",
  },
  expected: "1,2,3",
}, {
  title: "mixed types are converted to strings",
  conditions: {
    collection: [1, "two", true, null],
    separator: "|",
  },
  expected: "1|two|true|null",
}]

Deno.test("join()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = createReadable(conditions.collection)
      const observed = conditions.separator !== undefined
        ? await join(readable, conditions.separator)
        : await join(readable)
      assertEquals(observed, expected)
    })
  }
})
