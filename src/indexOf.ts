/**
 * Returns the index of the first occurrence of a specified value in a ReadableStream.
 * NOTE: This consumes the stream so it can't be reused after calling this function.
 *
 * @param readable The readable stream to search
 * @param value The value to search for
 * @returns A promise that resolves to the index of the value in the stream, or -1 if the value is not found.
 *
 * @example const index = await indexOf(readable, 42)
 * @example const index = await indexOf(readable, "hello")
 */
export const indexOf = async <T>(readable: ReadableStream<T>, value: T): Promise<number> => {
  let index = 0
  for await (const chunk of readable) {
    if (chunk === value) return index
    index++
  }
  return -1
}
