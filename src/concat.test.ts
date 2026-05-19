import { assertEquals, assertLess, assertRejects } from "asserts"
import { concat } from "./concat.ts"
import { list } from "./list.ts"
import { createReadable } from "./createReadable.ts"
import { slice } from "./slice.ts"

const TEST_CASES = [{
  title: "empty streams",
  iterators: [[], []],
  expected: [],
}, {
  title: "one empty stream",
  iterators: [[1, 2, 3], []],
  expected: [1, 2, 3],
}, {
  title: "two streams",
  iterators: [[1, 2, 3], [4, 5, 6]],
  expected: [1, 2, 3, 4, 5, 6],
}, {
  title: "three streams",
  iterators: [[1, 2], [3], [4, 5]],
  expected: [1, 2, 3, 4, 5],
}, {
  title: "three streams with empty",
  iterators: [[1, 2], [], [3, 4]],
  expected: [1, 2, 3, 4],
}]

Deno.test("concat() backpressure", async ({ step }) => {
  type InstrumentedStream = { stream: ReadableStream<number>; pulls: () => number }

  const buildInstrumented = (size: number): InstrumentedStream => {
    let pulls = 0
    let emitted = 0
    // highWaterMark=0 disables the constructor-time prefetch so we measure
    // only the pulls caused by the consumer, not the runtime's initial fill.
    const stream = new ReadableStream<number>({
      pull(controller) {
        pulls++
        if (emitted < size) controller.enqueue(emitted++)
        else controller.close()
      },
    }, { highWaterMark: 0 })
    return { stream, pulls: () => pulls }
  }

  await step("only pulls from later streams what the consumer actually requests", async () => {
    // A has 2 chunks → exhausts before slice(0,3) is done. slice needs 1 from B.
    // A buggy concat that drains in a single pull() reads many extra chunks
    // from B before the consumer's cancel signal can propagate.
    const a = buildInstrumented(2)
    const b = buildInstrumented(1000)
    const c = buildInstrumented(1000)
    const result = await list(slice(concat(a.stream, b.stream, c.stream), 0, 3))
    assertEquals(result, [0, 1, 0])
    // The exact b.pulls count depends on pipeTo's lookahead, but a buggy concat
    // that drains in a single pull pulls dozens of chunks before the consumer's
    // cancel signal propagates. A backpressure-respecting concat stays in
    // single digits regardless of stream size.
    assertLess(b.pulls(), 5, `concat should not drain stream b (got ${b.pulls()} pulls)`)
    assertEquals(c.pulls(), 0, "stream c should never be opened (not needed)")
  })
})

Deno.test("concat() error propagation", async ({ step }) => {
  await step("error in source stream propagates to consumer", async () => {
    const failing = new ReadableStream<number>({
      start(controller) {
        controller.enqueue(1)
        controller.error(new Error("source error"))
      },
    })
    const readable = concat(failing, createReadable([3, 4]))
    await assertRejects(
      () => list(readable),
      Error,
      "source error",
    )
  })
})

Deno.test("concat()", async ({ step }) => {
  for (const testCase of TEST_CASES) await runTest(testCase)

  async function runTest({ title, iterators, expected }: typeof TEST_CASES[0]) {
    await step(title, async () => {
      const readables = iterators.map((iterator) => createReadable(iterator))
      const readable = concat(...readables)
      const observed = await list(readable)
      assertEquals(observed, expected)
    })
  }
})
