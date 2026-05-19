import { assertEquals } from "asserts"
import { createReadable } from "./createReadable.ts"
import { list } from "./list.ts"
import { take } from "./take.ts"

Deno.test("take()", async ({ step }) => {
  await step("returns the first n chunks", async () => {
    assertEquals(await list(take(createReadable([1, 2, 3, 4, 5]), 3)), [1, 2, 3])
  })

  await step("returns empty when n is 0", async () => {
    assertEquals(await list(take(createReadable([1, 2, 3]), 0)), [])
  })

  await step("returns all chunks when n exceeds stream length", async () => {
    assertEquals(await list(take(createReadable([1, 2, 3]), 99)), [1, 2, 3])
  })

  await step("terminates an infinite stream", async () => {
    async function* forever(): AsyncGenerator<number> {
      let i = 0
      while (true) yield i++
    }
    assertEquals(await list(take(createReadable(forever()), 4)), [0, 1, 2, 3])
  })
})
