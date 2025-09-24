import { assertEquals } from "asserts/equals"
import { createReadable } from "./createReadable.ts"
import { branch } from "./branch.ts"
import { reduce } from "./reduce.ts"

const TEST_CASES = [
  {
    title: "empty stream",
    iterable: [],
    sum: 0,
  },
  {
    title: "one item",
    iterable: [1],
    sum: 1,
  },
  {
    title: "many items",
    iterable: [1, 2, 6, 1],
    sum: 10,
  },
]

Deno.test("branch()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, iterable, sum }: (typeof TEST_CASES)[0]) {
    await step(title, async () => {
      const stream = createReadable(iterable)
      assertEquals(stream.locked, false)

      const branches = branch(stream, 5)
      assertEquals(branches.length, 5)

      const promises = branches.map(async (b) => {
        const observed = await reduce(b, (acc, v) => acc + v, 0)
        assertEquals(observed, sum)
      })
      await Promise.all(promises)
    })
  }
})
