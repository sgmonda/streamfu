import { assertEquals } from "asserts"
import { createReadable } from "./createReadable.ts"
import { createWritable } from "./createWritable.ts"

const TEST_CASES = [{
  title: "collect a list of numbers into an empty array",
  conditions: {
    iterable: [1, 2, 3],
    buffer: [] as number[],
  },
  expected: [1, 2, 3],
}, {
  title: "collect a list of numbers into a non-empty array",
  conditions: {
    iterable: [1, 2, 3],
    buffer: [9, 9, 9],
  },
  expected: [9, 9, 9, 1, 2, 3],
}]

Deno.test("createWritable()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions, expected }: typeof TEST_CASES[number]) {
    const { iterable, buffer } = conditions
    await step(title, async () => {
      const writable = createWritable<number>((chunk) => {
        buffer.push(chunk)
      })
      const readable = createReadable(iterable)
      await readable.pipeTo(writable)
      assertEquals(buffer, expected)
    })
  }
})
