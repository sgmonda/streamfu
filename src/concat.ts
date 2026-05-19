import { ReadableStream } from "./system/stream.ts"

/**
 * Concatenates multiple readable streams into a single one, in order.
 *
 * Pulls from each source lazily and respects consumer backpressure: a source
 * is only opened when the previous one is fully drained, and never opened at
 * all if the consumer stops early (e.g. via `slice` or `take`).
 *
 * @param readables Streams to concatenate
 * @returns A new readable stream with all the chunks from the input streams
 *
 * @example const concatenated = concat(readable1, readable2, readable3)
 */
export const concat = <T>(...readables: ReadableStream<T>[]): ReadableStream<T> => {
  let cursor = 0
  let reader: ReadableStreamDefaultReader<T> | null = null
  return new ReadableStream<T>({
    async pull(controller) {
      while (cursor < readables.length) {
        if (!reader) reader = readables[cursor].getReader()
        const { done, value } = await reader.read()
        if (!done) {
          controller.enqueue(value)
          return
        }
        reader.releaseLock()
        reader = null
        cursor++
      }
      controller.close()
    },
    async cancel(reason) {
      if (reader) {
        await reader.cancel(reason)
        reader.releaseLock()
        reader = null
      }
    },
  })
}
