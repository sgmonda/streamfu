/**
 * Checks if some chunk in the readable stream satisfies the provided testing function.
 *
 * @param readable A readable stream whose chunks will be tested
 * @param predicate A function that accepts a chunk from the stream and returns a boolean
 * @returns A promise that resolves to true if some chunk passes the test, false otherwise
 *
 * @example const hasPositive = await some(readable, (chunk) => chunk > 0)
 * @example const hasEven = await some(readable, (chunk) => chunk % 2 === 0)
 */
export const some = async <T>(readable: ReadableStream<T>, predicate: (chunk: T) => boolean): Promise<boolean> => {
  for await (const chunk of readable) {
    if (predicate(chunk)) return true
  }
  return false
}
