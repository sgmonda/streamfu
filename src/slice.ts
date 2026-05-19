import { TransformStream } from "./system/stream.ts"

/**
 * Creates a new ReadableStream containing chunks at indices `[start, end)`
 * of the original stream. Mirrors `Array.prototype.slice` semantics: `start`
 * is inclusive, `end` is exclusive. If `end <= start`, the result is empty.
 *
 * @param readable A readable stream to slice
 * @param start The inclusive start index
 * @param end The exclusive end index (defaults to Infinity)
 * @returns A readable stream of the same type as the input stream
 *
 * @example const sliced = slice(stream, 2, 5)       // indices 2, 3, 4
 * @example const withoutFirst = slice(stream, 1)    // skip first chunk
 * @example const empty = slice(stream, 0, 0)        // empty window
 */
export const slice = <T>(readable: ReadableStream<T>, start: number, end: number = Infinity): ReadableStream<T> => {
  let index = 0
  const transform = new TransformStream<T, T>({
    start: (controller) => {
      if (end <= start) controller.terminate()
    },
    transform: (chunk, controller) => {
      if (index >= start && index < end) controller.enqueue(chunk)
      index++
      if (index >= end) controller.terminate()
    },
  })
  return readable.pipeThrough(transform)
}
