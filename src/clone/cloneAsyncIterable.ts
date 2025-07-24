function teeAsyncIterable<T>(
  iterable: AsyncIterable<T>,
  copies: number,
): AsyncIterable<T>[] {
  const iterator = iterable[Symbol.asyncIterator]()
  const buffers: T[][] = Array.from({ length: copies }, () => [])
  const dones: boolean[] = Array.from({ length: copies }, () => false)
  let done = false
  let pending: Promise<void> | null = null
  const waiters: Array<(() => void)[]> = Array.from(
    { length: copies },
    () => [],
  )

  async function fillBuffer() {
    if (done) return
    const { value, done: iterDone } = await iterator.next()
    if (!iterDone) {
      for (let i = 0; i < buffers.length; ++i) {
        buffers[i].push(value)
        if (waiters[i].length > 0) waiters[i].splice(0).forEach((fn) => fn())
      }
    } else {
      done = true
      for (let i = 0; i < waiters.length; ++i) {
        if (waiters[i].length > 0) waiters[i].splice(0).forEach((fn) => fn())
      }
    }
  }

  function makeClone(index: number): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator](): AsyncIterator<T> {
        return {
          async next(): Promise<IteratorResult<T>> {
            if (dones[index]) return { done: true, value: undefined }
            while (buffers[index].length === 0 && !done) {
              if (!pending) {
                pending = fillBuffer().finally(() => {
                  pending = null
                })
              }
              await new Promise<void>((resolve) => waiters[index].push(resolve))
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

  return Array.from({ length: copies }, (_, i) => makeClone(i))
}

export function cloneAsyncIterable<T>(
  iterable: AsyncIterable<T>,
  copies: number,
): AsyncIterable<T>[] {
  return teeAsyncIterable(iterable, copies)
}
