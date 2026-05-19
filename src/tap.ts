import { TransformStream } from "./system/stream.ts"

/**
 * Invokes a side-effect function for every chunk of a stream without
 * altering the chunks themselves. Useful for logging, metrics, or
 * accumulating into an external collector while keeping the stream
 * available for further transformations.
 *
 * The side-effect is awaited before the next chunk is forwarded, so async
 * effects keep their ordering. Errors thrown by the side-effect are
 * propagated to consumers.
 *
 * @param readable The readable stream to tap
 * @param fn The side-effect, called with each chunk and its index
 * @returns A new readable stream with the same chunks as the input
 *
 * @example tap(stream, (chunk, i) => log(`#${i}: ${chunk}`))
 * @example const collected: number[] = []; tap(stream, (n) => collected.push(n))
 */
export const tap = <T>(
  readable: ReadableStream<T>,
  fn: (chunk: T, i: number) => void | Promise<void>,
): ReadableStream<T> => {
  let i = 0
  const ts = new TransformStream<T, T>({
    transform: async (chunk, controller) => {
      try {
        await fn(chunk, i++)
        controller.enqueue(chunk)
      } catch (e) {
        controller.error(e)
      }
    },
  })
  return readable.pipeThrough(ts)
}
