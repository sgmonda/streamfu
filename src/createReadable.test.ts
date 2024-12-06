import { assertEquals } from "asserts"
import { createReadable } from "./createReadable.ts"
import { list } from "./list.ts"

const TEST_CASES = [{
  title: "from an array",
  iterable: [1, "two", 3, "four"],
  expected: [1, "two", 3, "four"],
}, {
  title: "from a string",
  iterable: "onetwothree",
  expected: ["o", "n", "e", "t", "w", "o", "t", "h", "r", "e", "e"],
}, {
  title: "from a map",
  iterable: new Map([["one", 1], ["two", 2], ["three", 3]]),
  expected: [["one", 1], ["two", 2], ["three", 3]],
}, {
  title: "from a set",
  iterable: new Set([1, 2, 3]),
  expected: [1, 2, 3],
}, {
  title: "from an async iterable (generator)",
  iterable: (async function* () {
    yield { a: 1 }
    yield { b: 2 }
    yield { c: 3 }
  })(),
  expected: [{ a: 1 }, { b: 2 }, { c: 3 }],
}, {
  title: "from an async iterable (promise)",
  iterable: (async function* () {
    yield Promise.resolve(1)
    yield Promise.resolve(2)
    yield Promise.resolve(3)
  })(),
  expected: [1, 2, 3],
}]

Deno.test("createReadable()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, iterable, expected }: typeof TEST_CASES[number]) {
    await step(title, async () => {
      const readable = createReadable(iterable)
      const observed = await list(readable as ReadableStream)
      assertEquals(observed, expected)
    })
  }
})
