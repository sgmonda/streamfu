import { assertEquals, assertRejects } from "asserts"
import { list } from "../list.ts"
import { iterate } from "./iterate.ts"

Deno.test("iterate()", async ({ step }) => {
  await step("emits values until the producer returns null", async () => {
    const stream = iterate((i) => (i < 5 ? i : null))
    assertEquals(await list(stream), [0, 1, 2, 3, 4])
  })

  await step("emits nothing if the first call returns null", async () => {
    const stream = iterate(() => null)
    assertEquals(await list(stream), [])
  })

  await step("supports async producers", async () => {
    const stream = iterate(async (i) => {
      await new Promise((r) => setTimeout(r, 0))
      return i < 3 ? `v${i}` : null
    })
    assertEquals(await list(stream), ["v0", "v1", "v2"])
  })

  await step("passes the zero-based call index to the producer", async () => {
    const seen: number[] = []
    const stream = iterate((i) => {
      seen.push(i)
      return i < 3 ? i : null
    })
    await list(stream)
    assertEquals(seen, [0, 1, 2, 3])
  })

  await step("emits zero as a real value (only null terminates)", async () => {
    const stream = iterate((i) => (i < 3 ? 0 : null))
    assertEquals(await list(stream), [0, 0, 0])
  })

  await step("propagates producer errors", async () => {
    const stream = iterate((i) => {
      if (i === 2) throw new Error("producer boom")
      return i
    })
    await assertRejects(() => list(stream), Error, "producer boom")
  })
})
