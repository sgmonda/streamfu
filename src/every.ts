/**
 * Checks if every chunk in the readable stream satisfies the provided testing function.
 * NOTE: This consumes the stream so it can't be reused after calling this function.
 *
 * @param readable A readable stream whose chunks will be tested
 * @param predicate A function that accepts a chunk from the stream and returns a boolean
 * @returns A promise that resolves to true if all chunks pass the test, false otherwise
 *
 * @example const areAllPositive = await every(readable, (chunk) => chunk > 0)
 * @example const areAllEven = await every(readable, (chunk) => chunk % 2 === 0)
 * @example const areAllArrays = await every(readable, (chunk) => Array.isArray(chunk))
 */
export const every = async <T>(readable: ReadableStream<T>, predicate: (chunk: T) => boolean): Promise<boolean> => {
  for await (const chunk of readable) {
    if (!predicate(chunk)) return false
  }
  return true
}
