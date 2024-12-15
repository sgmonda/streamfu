/**
 * Remove and/or insert items into a ReadableStream at a given index.
 *
 * @param readable The readable stream to splice
 * @param start The index at which to start changing the stream
 * @param deleteCount The number of items to remove from the stream
 * @param items The items to insert into the stream
 * @returns A readable stream with the items removed and/or inserted
 *
 * @example const oneless = splice(readable, 2, 1)
 * @example const spliced = splice(readable, 2, 1, 'a', 'b', 'c')
 */
export const splice = <T>(
  readable: ReadableStream<T>,
  start: number,
  deleteCount: number,
  ...items: T[]
): ReadableStream<T> => {
  const transform = new TransformStream<T, T>({
    transform: (chunk, controller) => {
      controller.enqueue(chunk)
    },
  })

  const writer = transform.writable.getWriter()
  let index = 0
  const reader = readable.getReader()

  const read = async () => {
    const { done, value } = await reader.read()
    if (done) {
      writer.close()
      return
    }

    if (index >= start && index < start + deleteCount) {
      index++
      read()
      return
    }

    if (index === start + deleteCount) {
      for (const item of items) {
        writer.write(item)
      }
    }

    writer.write(value)
    index++
    read()
  }

  read()

  return transform.readable
}
