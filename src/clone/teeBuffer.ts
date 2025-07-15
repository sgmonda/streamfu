export class TeeBuffer<T> {
  private iterator: Iterator<T>
  private buffers: T[][]
  private dones: boolean[]
  private done: boolean = false

  constructor(iterable: Iterable<T>, copies: number) {
    this.iterator = iterable[Symbol.iterator]()
    this.buffers = Array.from({ length: copies }, () => [])
    this.dones = Array.from({ length: copies }, () => false)
  }

  makeIterator(index: number): Iterable<T> {
    const self = this
    return {
      [Symbol.iterator](): Iterator<T> {
        return {
          next(): IteratorResult<T> {
            if (self.dones[index]) return { done: true, value: undefined }
            if (self.buffers[index].length === 0 && !self.done) {
              const { value, done } = self.iterator.next()
              if (!done) {
                for (let i = 0; i < self.buffers.length; ++i) {
                  self.buffers[i].push(value)
                }
              } else {
                self.done = true
              }
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
