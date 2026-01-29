import { PLATFORM, platform } from "./system/platform.ts"

type IReadable<T> = T extends Iterable<infer U> ? ReadableStream<U> : never

/**
 * Polyfill for ReadableStream.from() for runtimes that don't support it (like Bun)
 */
const readableStreamFrom = <T>(iterable: Iterable<T> | AsyncIterable<T>): ReadableStream<T> => {
  return new ReadableStream<T>({
    async start(controller) {
      for await (const chunk of iterable) {
        controller.enqueue(chunk)
      }
      controller.close()
    },
  })
}

/**
 * Creates a readable stream from an iterable. Every item in the iterable will be a chunk in the stream.
 * This way you can pipe the stream, transform it, etc.
 *
 * @param iterable Anything that is iterable, like an array, a generator, a string, etc.
 * @returns A readable stream
 *
 * @example const numsStream = createReadable([1, 2, 3, 4, 5]);
 * @example const numsStream = createReadable((async function* () { yield 1; yield 2; yield 3; })());
 * @example const numsStream = createReadable(new Set([1, 2, 3, 4, 5]));
 * @example const numsStream = createReadable('12345');
 */
export const createReadable = <T extends Iterable<unknown> | AsyncIterable<unknown>>(iterable: T): IReadable<T> => {
  if (typeof iterable === "string") {
    // Hack to support strings as iterables, since ReadableStream.from() fails with strings
    if (platform === PLATFORM.BUN) {
      return readableStreamFrom(iterable.split("")) as IReadable<T>
    }
    return ReadableStream.from(iterable.split("")) as IReadable<T>
  }

  // Use polyfill for Bun since ReadableStream.from() is not available
  if (platform === PLATFORM.BUN) {
    return readableStreamFrom(iterable as Iterable<unknown> | AsyncIterable<unknown>) as IReadable<T>
  }

  return ReadableStream.from(iterable) as IReadable<T>
}
