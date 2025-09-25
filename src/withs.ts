/**
 * Like Array.with(), but for ReadableStream. Replaces the value at the given index with the given value.
 *
 * @param readable Input stream
 * @param index Zero-based index at which to insert the value. Negative values count back from the end of the stream.
 * @param value Value to insert
 * @returns A new stream with the value inserted at the given index.
 */
export const withs = <T>(
  readable: ReadableStream<T>,
  index: number,
  value: T,
): ReadableStream<T> => {
  let i = 0
  const transform = new TransformStream<T, T>({
    transform: (chunk, controller) => {
      if (index < 0) {
        // TODO Implement
        return
      }
      if (i++ === index) {
        controller.enqueue(value)
        return
      }
      controller.enqueue(chunk)
    },
    flush: (controller) => {
      if (index > i) {
        controller.error(new RangeError(`Invalid index : ${index}`))
      } else if (index === i) {
        controller.enqueue(value)
      }
    },
  })

  return readable.pipeThrough(transform)
}
