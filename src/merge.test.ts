import { assert, assertEquals, assertRejects } from "asserts"
import { createReadable } from "./createReadable.ts"
import { list } from "./list.ts"
import { merge } from "./merge.ts"
import { take } from "./take.ts"

const delayed = <T>(items: T[], delayMs: number): ReadableStream<T> =>
  new ReadableStream<T>({
    async start(controller) {
      for (const item of items) {
        await new Promise((r) => setTimeout(r, delayMs))
        controller.enqueue(item)
      }
      controller.close()
    },
  })

Deno.test("merge()", async ({ step }) => {
  await step("emits chunks from all sources, preserving overall multiset", async () => {
    const result = await list(merge(createReadable([1, 2]), createReadable([10, 20]), createReadable([100])))
    assertEquals(result.length, 5)
    assertEquals(new Set(result), new Set([1, 2, 10, 20, 100]))
  })

  await step("interleaves based on arrival time, not source order", async () => {
    // Fast source A (no delay) vs slow source B (10ms). Fast source should appear first.
    const result = await list(merge(delayed(["fast-1", "fast-2"], 0), delayed(["slow"], 10)))
    assertEquals(result[0], "fast-1")
    assertEquals(result[1], "fast-2")
    assertEquals(result[2], "slow")
  })

  await step("returns empty for zero sources", async () => {
    assertEquals(await list(merge<number>()), [])
  })

  await step("works when one source is empty", async () => {
    const result = await list(merge(createReadable([1, 2, 3]), createReadable([] as number[])))
    assertEquals(new Set(result), new Set([1, 2, 3]))
  })

  await step("works with a single source", async () => {
    assertEquals(await list(merge(createReadable([1, 2, 3]))), [1, 2, 3])
  })

  await step("propagates errors from any source", async () => {
    const failing = new ReadableStream<number>({
      start(controller) {
        controller.enqueue(1)
        controller.error(new Error("kaboom"))
      },
    })
    await assertRejects(() => list(merge(createReadable([10, 20]), failing)), Error, "kaboom")
  })

  await step("cancels every source when the consumer stops early", async () => {
    const cancelled = [false, false, false]
    const make = (idx: number) =>
      new ReadableStream<number>({
        pull(controller) {
          controller.enqueue(idx)
        },
        cancel() {
          cancelled[idx] = true
        },
      })
    const result = await list(take(merge(make(0), make(1), make(2)), 1))
    assertEquals(result.length, 1)
    assertEquals(cancelled, [true, true, true])
  })

  await step("keeps yielding from remaining sources after one closes", async () => {
    const fastFinish = delayed([1], 0)
    const slow = delayed([10, 20, 30], 5)
    const result = await list(merge(fastFinish, slow))
    assert(result.indexOf(1) < result.indexOf(10), "fast source should arrive first")
    assertEquals(new Set(result), new Set([1, 10, 20, 30]))
  })
})
