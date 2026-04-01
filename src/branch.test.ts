import { assertEquals, assertThrows } from "asserts"
import { createReadable } from "./createReadable.ts"
import { branch } from "./branch.ts"
import { reduce } from "./reduce.ts"

const TEST_CASES = [
  {
    title: "empty stream",
    iterable: [],
    sum: 0,
    mul: 1,
  },
  {
    title: "one item",
    iterable: [1],
    sum: 1,
    mul: 1,
  },
  {
    title: "many items",
    iterable: [1, 2, 6, 1],
    sum: 10,
    mul: 12,
  },
]

Deno.test("branch()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({
    title,
    iterable,
    sum,
    mul,
  }: (typeof TEST_CASES)[0]) {
    await step(title, async () => {
      const stream = createReadable(iterable)
      assertEquals(stream.locked, false)

      const branches = branch(stream, 5)
      assertEquals(branches.length, 5)

      assertEquals(await reduce(branches[0], sumReducer, 0), sum)
      assertEquals(await reduce(branches[1], sumReducer, 0), sum)
      assertEquals(await reduce(branches[2], mulReducer, 1), mul)
      assertEquals(await reduce(branches[3], mulReducer, 1), mul)
      assertEquals(await reduce(branches[4], mulReducer, 1), mul)
    })
  }
})

Deno.test("branch() error handling", async ({ step }) => {
  await step("n < 1 throws RangeError", () => {
    const stream = createReadable([1, 2, 3])
    assertThrows(() => branch(stream, 0), RangeError, "n must be >= 1")
  })

  await step("locked stream throws TypeError", () => {
    const stream = createReadable([1, 2, 3])
    stream.getReader() // locks the stream
    assertThrows(() => branch(stream, 2), TypeError)
  })
})

const sumReducer = (acc: number, v: number) => acc + v
const mulReducer = (acc: number, v: number) => acc * v
