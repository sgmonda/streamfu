function makeClone<T>(
  iterable: Iterable<T>,
  copies: number,
  index: number,
): Iterable<T> {
  const iterator = iterable[Symbol.iterator]()
  const buffers: T[][] = Array.from({ length: copies }, () => [])
  const dones: boolean[] = Array.from({ length: copies }, () => false)
  let done = false

  return {
    [Symbol.iterator](): Iterator<T> {
      return {
        next(): IteratorResult<T> {
          if (dones[index]) return { done: true, value: undefined }
          if (buffers[index].length === 0 && !done) {
            const { value, done: iterDone } = iterator.next()
            if (!iterDone) {
              for (let i = 0; i < buffers.length; ++i) {
                buffers[i].push(value)
              }
            } else {
              done = true
            }
          }
          if (buffers[index].length > 0) {
            const value = buffers[index].shift()!
            return { value, done: false }
          } else {
            dones[index] = true
            return { done: true, value: undefined }
          }
        },
      }
    },
  }
}

export function teeIterable<T>(
  iterable: Iterable<T>,
  copies: number,
): Iterable<T>[] {
  return Array.from({ length: copies }, (_, i) => makeClone<T>(iterable, copies, i))
}
