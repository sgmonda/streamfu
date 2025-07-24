function makeClone<T>(
  iterable: AsyncIterable<T>,
  copies: number,
  index: number,
): AsyncIterable<T> {
  const iterator = iterable[Symbol.asyncIterator]()
  const buffers: T[][] = Array.from({ length: copies }, () => [])
  const dones: boolean[] = Array.from({ length: copies }, () => false)
  let done = false
  let pending: Promise<void> | null = null

  return {
    [Symbol.asyncIterator](): AsyncIterator<T> {
      return {
        async next(): Promise<IteratorResult<T>> {
          if (dones[index]) return { done: true, value: undefined }
          while (buffers[index].length === 0 && !done) {
            if (!pending) {
              pending = (async () => {
                const { value, done: iterDone } = await iterator.next()
                if (!iterDone) {
                  for (let i = 0; i < buffers.length; ++i) {
                    buffers[i].push(value)
                  }
                } else {
                  done = true
                }
                pending = null
              })()
            }
            await pending
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

export function teeAsyncIterable<T>(
  iterable: AsyncIterable<T>,
  copies: number,
): AsyncIterable<T>[] {
  return Array.from({ length: copies }, (_, i) => makeClone<T>(iterable, copies, i))
}
