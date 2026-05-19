import { TransformStream } from "./system/stream.ts"

/**
 * Filter stream chunks based on a predicate function.
 *
 * @param readable A readable stream to filter
 * @param fn The predicate, applied to each chunk with its index. When it returns `true`, the chunk is forwarded.
 * @returns A readable stream whose chunks are the ones that passed the predicate function
 *
 * @example const onlyEven = filter(stream, (n) => n % 2 === 0)
 * @example const dropFirstThree = filter(stream, (_, i) => i >= 3)
 * @example const evenIndexed = filter(stream, (_, i) => i % 2 === 0)
 */
export const filter = <T>(
  readable: ReadableStream<T>,
  fn: (chunk: T, i: number) => boolean | Promise<boolean>,
): ReadableStream<T> => {
  let i = 0
  const ts = new TransformStream<T, T>({
    transform: async (chunk, controller) => {
      try {
        if (await fn(chunk, i++)) controller.enqueue(chunk)
      } catch (e) {
        controller.error(e)
      }
    },
  })
  return readable.pipeThrough(ts)
}
