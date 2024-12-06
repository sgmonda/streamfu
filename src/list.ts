import { reduce } from "./reduce.ts"

/**
 * Retrieve all items from a readable stream to build a list of chunks
 *
 * @param readable The readable stream to get items from
 * @returns A list whose items are the readable chunks
 *
 * @example const arr = list(readable1)
 */
export const list = <T>(readable: ReadableStream<T>): Promise<T[]> => {
  return reduce(readable, (accum: T[], chunk: T) => [...accum, chunk], [])
}
