/**
 * Joins all elements of a readable stream into a string, separated by the specified separator.
 * This is similar to the `Array.prototype.join` method.
 * NOTE: This consumes the stream so it can't be reused after calling this function.
 *
 * @param readable The readable stream to join
 * @param separator The separator string to use between elements (defaults to ",")
 * @returns A promise that resolves to the joined string
 *
 * @example const csv = await join(readable, ",")
 * @example const text = await join(readable, " ")
 */
export const join = async <T>(readable: ReadableStream<T>, separator = ","): Promise<string> => {
  let result = ""
  let first = true
  for await (const chunk of readable) {
    if (!first) result += separator
    result += String(chunk)
    first = false
  }
  return result
}
