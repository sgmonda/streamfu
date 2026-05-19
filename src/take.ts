import { slice } from "./slice.ts"

/**
 * Returns a new stream with the first `n` chunks of the input stream.
 * Equivalent to `slice(stream, 0, n)`. Mirrors the array helper from
 * functional libraries.
 *
 * @param readable A readable stream
 * @param n The number of chunks to keep from the start
 * @returns A new readable stream with at most `n` chunks
 *
 * @example const first5 = take(stream, 5)
 * @example const head = take(infiniteStream, 100) // safely terminates
 */
export const take = <T>(readable: ReadableStream<T>, n: number): ReadableStream<T> => slice(readable, 0, n)
