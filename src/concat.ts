/**
 * Concatenates multiple readable streams into a single one.
 *
 * @param readables Streams to concatenate
 * @returns A new readable stream with all the chunks from the input streams
 *
 * @example const concatenated = concat(readable1, readable2, readable3)
 */
export const concat = <T>(...readables: ReadableStream<T>[]): ReadableStream<T> => {
  return new ReadableStream({
    async pull(controller) {
      for (const readable of readables) {
        const reader = readable.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(value)
        }
      }
      controller.close()
    },
  })
}
