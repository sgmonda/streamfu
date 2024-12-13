import { assertEquals } from "asserts/equals"
import { concat } from "./concat.ts"
import { list } from "./list.ts"
import { createReadable } from "./createReadable.ts"

const TEST_CASES = [{
  title: "empty streams",
  iterators: [[], []],
  expected: [],
}, {
  title: "one empty stream",
  iterators: [[1, 2, 3], []],
  expected: [1, 2, 3],
}, {
  title: "two streams",
  iterators: [[1, 2, 3], [4, 5, 6]],
  expected: [1, 2, 3, 4, 5, 6],
}, {
  title: "three streams",
  iterators: [[1, 2], [3], [4, 5]],
  expected: [1, 2, 3, 4, 5],
}, {
  title: "three streams with empty",
  iterators: [[1, 2], [], [3, 4]],
  expected: [1, 2, 3, 4],
}]

Deno.test("concat()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, iterators, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readables = iterators.map((iterator) => createReadable(iterator))
      const readable = concat(...readables)
      const observed = await list(readable)
      assertEquals(observed, expected)
    })
  }
})
