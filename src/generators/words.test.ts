import { assertEquals } from "asserts/equals"
import { list } from "../list.ts"
import { words } from "./words.ts"
import { assert } from "asserts/assert"

const TEST_CASES = [{
  title: "empty stream",
  conditions: { chars: 5, length: 0 },
}, {
  title: "one word",
  conditions: { chars: 5, length: 1 },
}, {
  title: "two words",
  conditions: { chars: 5, length: 2 },
}, {
  title: "20 large words",
  conditions: { chars: 100, length: 20 },
}, {
  title: "2k small words",
  conditions: { chars: 4, length: 2000 },
}]

Deno.test("words()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, conditions }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readable = words(conditions.chars, conditions.length)
      const observed = await list(readable)
      observed.forEach((word: string) => {
        assert(/^[a-zA-Z0-9]+$/.test(word))
        assertEquals(word.length, conditions.chars)
      })
    })
  }
})
