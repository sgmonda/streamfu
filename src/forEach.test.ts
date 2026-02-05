import { assertEquals } from "asserts"
import { createReadable } from "./createReadable.ts"
import { forEach } from "./forEach.ts"

Deno.test("forEach()", async ({ step }) => {
  await step("empty stream", async () => {
    const collected: number[] = []
    const readable = createReadable([] as number[])
    await forEach(readable, (chunk) => {
      collected.push(chunk)
    })
    assertEquals(collected, [])
  })

  await step("iterate over all chunks", async () => {
    const readable = createReadable([1, 2, 3])
    assertEquals(await forEach(readable, () => {}), undefined)
  })

  await step("iterate over all chunks, collecting", async () => {
    const collected: number[] = []
    const readable = createReadable([1, 2, 3])
    await forEach(readable, (chunk) => {
      collected.push(chunk)
    })
    assertEquals(collected, [1, 2, 3])
  })

  await step("receive correct index", async () => {
    const indices: number[] = []
    const readable = createReadable(["a", "b", "c"])
    await forEach(readable, (_chunk, i) => {
      indices.push(i)
    })
    assertEquals(indices, [0, 1, 2])
  })

  await step("support async callbacks", async () => {
    const collected: number[] = []
    const readable = createReadable([10, 20, 30])
    await forEach(readable, async (chunk) => {
      await new Promise((resolve) => setTimeout(resolve, 1))
      collected.push(chunk)
    })
    assertEquals(collected, [10, 20, 30])
  })

  await step("reject on callback error", async () => {
    const readable = createReadable([1, 2, 3])
    try {
      await forEach(readable, (chunk) => {
        if (chunk === 2) throw new Error("crash")
      })
      throw new Error("Expected an error")
    } catch (error: unknown) {
      if (!(error instanceof Error)) throw error
      assertEquals(error.message, "crash")
    }
  })

  await step("reject on async callback error", async () => {
    const readable = createReadable([1, 2, 3])
    try {
      await forEach(readable, async (chunk) => {
        if (chunk === 2) return await Promise.reject(new Error("async crash"))
      })
      throw new Error("Expected an error")
    } catch (error: unknown) {
      if (!(error instanceof Error)) throw error
      assertEquals(error.message, "async crash")
    }
  })
})
