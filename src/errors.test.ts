import { assert } from "asserts/assert"
import { UnknownPlatformError } from "./errors.ts"

const TEST_CASES = [{
  error: UnknownPlatformError,
  expectedPartial: "Unknown platform. Supported",
}]

Deno.test("StreamFuError", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ error, expectedPartial }: typeof TEST_CASES[number]) {
    await step(error.name, () => {
      try {
        throw new error()
      } catch (error: unknown) {
        if (!(error instanceof Error)) throw error
        const { message } = error
        assert(message.includes(expectedPartial))
      }
    })
  }
})
