import { assertEquals } from "asserts/equals"
import { createReadable } from "./createReadable.ts"
import { list } from "./list.ts"

const TEST_CASES = [{
  title: "empty readable",
  readable: createReadable([]),
  expected: [],
}, {
  title: "numbers list",
  readable: createReadable([1, 2, 3, 4]),
  expected: [1, 2, 3, 4],
}, {
  title: "objects list",
  readable: createReadable([{ a: 1, b: 2 }, { c: 3 }]),
  expected: [{ a: 1, b: 2 }, { c: 3 }],
}]

Deno.test("list()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, readable, expected }: typeof TEST_CASES[number]) {
    await step(title, async () => {
      const observed = await list(readable as ReadableStream)
      assertEquals(observed, expected)
    })
  }
})
