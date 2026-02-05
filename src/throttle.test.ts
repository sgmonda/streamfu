import { assertEquals } from "asserts/equals"
import { createReadable } from "./createReadable.ts"
import { list } from "./list.ts"
import { throttle } from "./throttle.ts"

const DATA = [1, 2, 3, 4, 5, 6, 7]
const DELAY = 100

Deno.test("throttle()", async ({ step }) => {
  let callsCount = 0
  const factory = () => {
    callsCount++
    return createReadable(DATA)
  }

  const fun = throttle(factory, DELAY, () => "hello, world")

  await step("Should not call factory() during time window: before", () => {
    assertEquals(callsCount, 0)
  })

  await step("Should return identical data for all readables", async () => {
    const readables = repeat(1000).map(() => fun())
    for (const readable of readables) {
      const data = await list(readable)
      assertEquals(data, DATA)
    }
  })

  await step("Should not call factory() during time window: after", () => {
    assertEquals(callsCount, 1)
  })

  await sleep(DELAY)

  await step("Should call factory() only once, on time window end", () => {
    assertEquals(callsCount, 1)
  })

  await sleep(DELAY)

  await step("Should not call factory() again unless new consumers", () => {
    assertEquals(callsCount, 1)
  })

  await step("Should consume according to each consumer pacing", async () => {
    assertEquals(await list(fun()), DATA)
    assertEquals(await list(fun()), DATA)
    assertEquals(await list(fun()), DATA)
  })

  await step("Should call factory() again after each full consuming", () => {
    assertEquals(callsCount, 4)
  })

  await step("Should not call factory() if nobody consumes", async () => {
    await sleep(DELAY)
    await sleep(DELAY)
    await sleep(DELAY)
    await sleep(DELAY)
    assertEquals(callsCount, 4)
  })

  await step("Should call factory() once per window", async () => {
    fun()
    fun()
    await sleep(DELAY)
    fun()
    fun()
    await sleep(DELAY)
    fun()
    fun()
    await sleep(DELAY)

    assertEquals(callsCount, 7)
  })
})

const repeat = (times: number) => Array.from({ length: times })
const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))
