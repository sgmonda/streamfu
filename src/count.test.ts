import { assertEquals, assertRejects } from "asserts"
import { count } from "./count.ts"
import { createReadable } from "./createReadable.ts"
import { range } from "./generators/range.ts"
import { slice } from "./slice.ts"

Deno.test("count()", async ({ step }) => {
  await step("returns 0 for an empty stream", async () => {
    assertEquals(await count(createReadable([] as number[])), 0)
  })

  await step("counts plain items", async () => {
    assertEquals(await count(createReadable([1, 2, 3])), 3)
  })

  await step("counts chunks regardless of value (undefined, null)", async () => {
    assertEquals(await count(createReadable([undefined, null, 0, ""])), 4)
  })

  await step("works with sliced streams and respects backpressure", async () => {
    const head = slice(range(0, 1_000_000), 0, 5)
    assertEquals(await count(head), 5)
  })

  await step("propagates source errors", async () => {
    const failing = new ReadableStream<number>({
      start(controller) {
        controller.enqueue(1)
        controller.error(new Error("boom"))
      },
    })
    await assertRejects(() => count(failing), Error, "boom")
  })
})
