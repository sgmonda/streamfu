export const list = <T>(readable: ReadableStream<T>): Promise<T[]> => {
  return new Promise((resolve) => {
    const reader = readable.getReader()
    const chunks: T[] = []
    const read = async () => {
      const { done, value } = await reader.read()
      if (done) {
        return resolve(chunks)
      }
      chunks.push(value)
      await read()
    }
    read()
  })
}
