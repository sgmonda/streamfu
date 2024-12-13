/**
 * Retrieve the value at the given index from a ReadableStream
 *
 * @param readable A readable stream to get the value from
 * @param index The index of the value to retrieve
 * @returns The value at the given index, or undefined if the index is out of bounds
 *
 * @example const value = await at(readable, 5)
 */
export const at = async <T>(readable: ReadableStream<T>, index: number): Promise<T | undefined> => {
  let i = 0
  for await (const chunk of readable) {
    if (i === index) return chunk
    i++
  }
  return undefined
}
