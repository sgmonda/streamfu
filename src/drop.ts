import { slice } from "./slice.ts"

/**
 * Returns a new stream that skips the first `n` chunks of the input stream.
 * Equivalent to `slice(stream, n)`.
 *
 * @param readable A readable stream
 * @param n The number of chunks to skip from the start
 * @returns A new readable stream with the remaining chunks
 *
 * @example const tail = drop(stream, 1)
 * @example const afterHeader = drop(stream, 1) // skip CSV header
 */
export const drop = <T>(readable: ReadableStream<T>, n: number): ReadableStream<T> => slice(readable, n)
