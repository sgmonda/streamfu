export class AsyncTeeBuffer<T> {
  private iterator: AsyncIterator<T>
  private buffers: T[][]
  private dones: boolean[]
  private done: boolean = false
  private pending: Promise<void> | null = null

  constructor(iterable: AsyncIterable<T>, copies: number) {
    this.iterator = iterable[Symbol.asyncIterator]()
    this.buffers = Array.from({ length: copies }, () => [])
    this.dones = Array.from({ length: copies }, () => false)
  }

  makeAsyncIterator(index: number): AsyncIterable<T> {
    const self = this
    return {
      [Symbol.asyncIterator](): AsyncIterator<T> {
        return {
          async next(): Promise<IteratorResult<T>> {
            if (self.dones[index]) return { done: true, value: undefined }
            while (self.buffers[index].length === 0 && !self.done) {
              if (!self.pending) {
                self.pending = (async () => {
                  const { value, done } = await self.iterator.next()
                  if (!done) {
                    for (let i = 0; i < self.buffers.length; ++i) {
                      self.buffers[i].push(value)
                    }
                  } else {
                    self.done = true
                  }
                  self.pending = null
                })()
              }
              await self.pending
            }
            if (self.buffers[index].length > 0) {
              const value = self.buffers[index].shift()!
              return { value, done: false }
            } else {
              self.dones[index] = true
              return { done: true, value: undefined }
            }
          },
        }
      },
    }
  }
}
