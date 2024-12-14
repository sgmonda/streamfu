/**
 * Creates a new ReadableStream that contains only the elements between the start and end indexes of the original stream.
 *
 * @param readable A readable stream to slice
 * @param start The start index
 * @param end The end index
 * @returns A readable stream of the same type as the input stream
 *
 * @example const sliced = slice(readable, 2, 5)
 * @example const withoutFirst = slice(readable, 1)
 */
export const slice = <T>(readable: ReadableStream<T>, start: number, end: number = Infinity): ReadableStream<T> => {
  const transform = new TransformStream<T, T>({
    transform: (chunk, controller) => {
      if (start <= 0) {
        controller.enqueue(chunk)
      } else {
        start--
      }
      if (end > 1) {
        end--
      } else {
        controller.terminate()
      }
    },
  })
  return readable.pipeThrough(transform)
}
