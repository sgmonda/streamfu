/**
 * Replace items from a ReadableStream, starting at a given index.
 *
 * @param readable The readable stream to splice
 * @param start The index at which to start replacing items from the stream
 * @param replaced The number of items to replace from the stream. If 0, no items will be removed or inserted
 * @param newItems The items to insert into the stream
 * @returns A readable stream with the items removed and/or inserted
 *
 * @example const oneless = splice(readable, 2, 1)
 * @example const spliced = splice(readable, 2, 1, 'a', 'b', 'c')
 */
export const splice = <T>(
  readable: ReadableStream<T>,
  start: number,
  replaced: number,
  ...newItems: T[]
): ReadableStream<T> => {
  let index = 0
  const transform = new TransformStream<T, T>({
    transform: (chunk, controller) => {
      if (index++ >= start && replaced > 0) {
        replaced--
        if (!replaced) {
          newItems.forEach((item) => controller.enqueue(item))
        }
        return
      }
      controller.enqueue(chunk)
    },
  })

  return readable.pipeThrough(transform)
}
