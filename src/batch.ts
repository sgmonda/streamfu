import { TransformStream } from "./system/stream.ts"

/**
 * Groups consecutive chunks into arrays of `size` elements. The final batch
 * may be smaller than `size` if the stream does not divide evenly.
 *
 * Useful for amortizing per-chunk overhead (e.g. inserting rows in batches
 * of 1000 into a database, sending events in groups to an API).
 *
 * @param readable The readable stream to batch
 * @param size The batch size (must be a positive integer)
 * @returns A readable stream of arrays, each of length `size` (except possibly the last)
 * @throws RangeError if `size` is not a positive integer
 *
 * @example const inserts = batch(rows, 1000) // emits [...1000 rows] arrays
 * @example list(batch(createReadable([1,2,3,4,5]), 2)) // [[1,2],[3,4],[5]]
 */
export const batch = <T>(readable: ReadableStream<T>, size: number): ReadableStream<T[]> => {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError(`batch size must be a positive integer, got ${size}`)
  }
  let buffer: T[] = []
  const transform = new TransformStream<T, T[]>({
    transform: (chunk, controller) => {
      buffer.push(chunk)
      if (buffer.length === size) {
        controller.enqueue(buffer)
        buffer = []
      }
    },
    flush: (controller) => {
      if (buffer.length > 0) {
        controller.enqueue(buffer)
        buffer = []
      }
    },
  })
  return readable.pipeThrough(transform)
}
