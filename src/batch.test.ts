import { assertEquals, assertThrows } from "asserts"
import { batch } from "./batch.ts"
import { createReadable } from "./createReadable.ts"
import { list } from "./list.ts"

Deno.test("batch()", async ({ step }) => {
  await step("groups chunks into arrays of given size", async () => {
    const stream = batch(createReadable([1, 2, 3, 4, 5, 6]), 3)
    assertEquals(await list(stream), [[1, 2, 3], [4, 5, 6]])
  })

  await step("emits a final partial batch with the remainder", async () => {
    const stream = batch(createReadable([1, 2, 3, 4, 5, 6, 7]), 3)
    assertEquals(await list(stream), [[1, 2, 3], [4, 5, 6], [7]])
  })

  await step("emits nothing for an empty stream", async () => {
    const stream = batch(createReadable([] as number[]), 3)
    assertEquals(await list(stream), [])
  })

  await step("size 1 emits singletons", async () => {
    const stream = batch(createReadable(["a", "b", "c"]), 1)
    assertEquals(await list(stream), [["a"], ["b"], ["c"]])
  })

  await step("throws RangeError when size is 0", () => {
    assertThrows(() => batch(createReadable([1, 2]), 0), RangeError)
  })

  await step("throws RangeError when size is negative", () => {
    assertThrows(() => batch(createReadable([1, 2]), -1), RangeError)
  })

  await step("throws RangeError when size is not an integer", () => {
    assertThrows(() => batch(createReadable([1, 2]), 1.5), RangeError)
  })
})
