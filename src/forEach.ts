type IForEachCallback<T> = (chunk: T, index: number) => void | Promise<void>

/**
 * Executes a provided function once for each chunk in the readable stream.
 * NOTE: This consumes the stream so it can't be reused after calling this function.
 *
 * @param readable A readable stream whose chunks will be iterated
 * @param fn A function to execute for each chunk, receiving the chunk and its index
 * @returns A promise that resolves when all chunks have been processed
 *
 * @example await forEach(readable, (chunk) => console.log(chunk))
 * @example await forEach(readable, (chunk, i) => console.log(`${i}: ${chunk}`))
 */
export const forEach = async <T>(
  readable: ReadableStream<T>,
  fn: IForEachCallback<T>,
): Promise<void> => {
  let index = 0
  for await (const chunk of readable) {
    await fn(chunk, index++)
  }
}
