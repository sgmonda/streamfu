import { assertEquals } from "asserts"
import { createReadable } from "./createReadable.ts"
import { drop } from "./drop.ts"
import { list } from "./list.ts"

Deno.test("drop()", async ({ step }) => {
  await step("skips the first n chunks", async () => {
    assertEquals(await list(drop(createReadable([1, 2, 3, 4, 5]), 2)), [3, 4, 5])
  })

  await step("returns the full stream when n is 0", async () => {
    assertEquals(await list(drop(createReadable([1, 2, 3]), 0)), [1, 2, 3])
  })

  await step("returns empty when n exceeds stream length", async () => {
    assertEquals(await list(drop(createReadable([1, 2, 3]), 99)), [])
  })
})
