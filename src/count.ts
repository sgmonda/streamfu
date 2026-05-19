import { reduce } from "./reduce.ts"

/**
 * Counts the number of chunks in a readable stream.
 * NOTE: This consumes the stream so it can't be reused after calling this function.
 *
 * @param readable The readable stream to count
 * @returns A promise that resolves to the number of chunks read
 *
 * @example const total = await count(stream)
 * @example const firstFive = await count(slice(stream, 0, 5)) // 5
 */
export const count = <T>(readable: ReadableStream<T>): Promise<number> => {
  return reduce(readable, (n: number) => n + 1, 0)
}
