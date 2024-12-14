import { flat } from "./flat.ts"
import { map } from "./map.ts"

/**
 * Creates a new stream by applying a function to each chunk of the input stream and then flattening the result by one level.
 * It is identical to a `map()` followed by a `flat()`.
 *
 * @param readable A readable stream
 * @param mapper A function that, given a chunk from the input stream, returns an array.
 * @returns A new readable stream with the concatenated results of calling the mapper function on each chunk of the input stream.
 *
 * @example const readable = flatMap(readable1, (chunk) => [chunk, chunk])
 */
export const flatMap = <T, U>(
  readable: ReadableStream<T>,
  mapper: (chunk: T) => U[],
): ReadableStream<U> => {
  const mapped = map(readable, mapper)
  return flat<U>(mapped)
}
