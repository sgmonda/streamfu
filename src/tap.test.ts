import { assertEquals, assertRejects } from "asserts"
import { createReadable } from "./createReadable.ts"
import { list } from "./list.ts"
import { tap } from "./tap.ts"

Deno.test("tap()", async ({ step }) => {
  await step("forwards every chunk untouched", async () => {
    const stream = tap(createReadable([1, 2, 3]), () => {})
    assertEquals(await list(stream), [1, 2, 3])
  })

  await step("invokes the side-effect once per chunk with its index", async () => {
    const seen: Array<[number, number]> = []
    const stream = tap(createReadable([10, 20, 30]), (chunk, i) => {
      seen.push([chunk, i])
    })
    await list(stream)
    assertEquals(seen, [[10, 0], [20, 1], [30, 2]])
  })

  await step("awaits async side-effects before forwarding the next chunk", async () => {
    const order: string[] = []
    const stream = tap(createReadable([1, 2, 3]), async (chunk) => {
      await new Promise((r) => setTimeout(r, 0))
      order.push(`tap-${chunk}`)
    })
    for await (const chunk of stream) order.push(`out-${chunk}`)
    assertEquals(order, ["tap-1", "out-1", "tap-2", "out-2", "tap-3", "out-3"])
  })

  await step("propagates errors thrown by the side-effect", async () => {
    const stream = tap(createReadable([1, 2, 3]), (chunk) => {
      if (chunk === 2) throw new Error("kaboom")
    })
    await assertRejects(() => list(stream), Error, "kaboom")
  })
})
