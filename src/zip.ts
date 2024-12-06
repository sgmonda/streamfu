type ITuple<T> = { [K in keyof T]: T[K] extends ReadableStream<infer U> ? U : never }

async function* zipGenerator<T extends readonly ReadableStream<unknown>[]>(
  ...streams: T
): AsyncGenerator<ITuple<T>> {
  if (!streams.length) return
  const readers = streams.map((stream) => stream.getReader())
  try {
    while (true) {
      const promises = readers.map((reader) => reader.read())
      const results = await Promise.all(promises)
      const isFinished = results.some(({ done }) => done)
      if (isFinished) break
      yield results.map(({ value }) => value) as ITuple<T>
    }
  } finally {
    readers.forEach((reader) => reader.releaseLock())
  }
}

export function zip<T extends readonly ReadableStream<unknown>[]>(
  ...streams: T
): ReadableStream<ITuple<T>> {
  return new ReadableStream({
    async pull(controller) {
      const generator = zipGenerator(...streams)
      try {
        for await (const chunk of generator) {
          controller.enqueue(chunk)
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })
}
