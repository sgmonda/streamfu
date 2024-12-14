/**
 * Check if a value is included in a readable stream
 *
 * @param readable The readable stream to check
 * @param value The value to search for
 * @returns A promise that resolves to true if the value is found, false otherwise.
 *
 * @example const hasValue = await includes(readable, 42)
 * @example const hasString = await includes(readable, "hello")
 */
export const includes = async <T>(readable: ReadableStream<T>, value: T): Promise<boolean> => {
  for await (const chunk of readable) {
    if (chunk === value) return true
  }
  return false
}
