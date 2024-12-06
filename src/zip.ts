type ITuple<T> = { [K in keyof T]: T[K] extends ReadableStream<infer U> ? U : never }

/**
 * Combines many readables into a new one whose chunks are tuples
 * containing one item from each input readable.
 * Shortest stream will determine the output stream length.
 *
 * @param readables Readable streams to get chunks from
 * @returns A new ReadableStream of tuples
 *
 * @example const tuples = zip(readable1, readable2, readable3)
 */
export function zip<T extends readonly ReadableStream<unknown>[]>(
  ...readables: T
): ReadableStream<ITuple<T>> {
  return new ReadableStream({
    async pull(controller) {
      const generator = zipGenerator(...readables)
      for await (const chunk of generator) {
        controller.enqueue(chunk)
      }
      controller.close()
    },
  })
}

async function* zipGenerator<T extends readonly ReadableStream<unknown>[]>(
  ...readables: T
): AsyncGenerator<ITuple<T>> {
  const readers = readables.map((stream) => stream.getReader())
  while (true) {
    const nextTuple = await getNextTuple<T>(readers)
    if (!nextTuple) break
    yield nextTuple
  }
}

const getNextTuple = async <T>(readers: ReadableStreamDefaultReader[]): Promise<ITuple<T> | null> => {
  const results = await Promise.all(readers.map((reader) => reader.read()))
  const isFinished = !results.length || results.some(({ done }) => done)
  if (isFinished) return null
  return results.map(({ value }) => value) as ITuple<T>
}
