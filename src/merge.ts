import { ReadableStream } from "./system/stream.ts"

type Win<T> = { idx: number; result: ReadableStreamReadResult<T> }

/**
 * Merges multiple readable streams into a single stream that emits chunks
 * as they arrive, regardless of which source produced them.
 *
 * Contrast with:
 * - `concat(...)`: emits from each source in order, draining one before the
 *   next. Preserves per-source order, ignores arrival time.
 * - `zip(...)`: pairs up the Nth chunk of each source. Requires the consumer
 *   to align sources.
 *
 * If any source errors, the merged stream errors. When the merged stream is
 * cancelled, all source readers are cancelled.
 *
 * @param sources The readable streams to merge
 * @returns A readable stream that interleaves chunks by arrival time
 *
 * @example const events = merge(websocketEvents, sseEvents, pollingEvents)
 */
export const merge = <T>(...sources: ReadableStream<T>[]): ReadableStream<T> => {
  const readers = sources.map((s) => s.getReader())
  const pending = new Map<number, Promise<Win<T>>>()
  const queueRead = (idx: number) => {
    pending.set(idx, readers[idx].read().then((result) => ({ idx, result })))
  }
  return new ReadableStream<T>({
    start: () => {
      for (let i = 0; i < readers.length; i++) queueRead(i)
    },
    pull: async (controller) => {
      while (pending.size > 0) {
        const win = await Promise.race(pending.values())
        if (win.result.done) {
          pending.delete(win.idx)
          continue
        }
        controller.enqueue(win.result.value)
        queueRead(win.idx)
        return
      }
      controller.close()
    },
    cancel: async (reason) => {
      pending.clear()
      await Promise.all(readers.map((r) => r.cancel(reason).catch(() => {})))
    },
  })
}
