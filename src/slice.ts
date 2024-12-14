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
