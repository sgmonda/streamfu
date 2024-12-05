type IReadable<T> = T extends Iterable<infer U> ? ReadableStream<U> : never

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
    return ReadableStream.from(iterable.split("")) as IReadable<T>
  }
  return ReadableStream.from(iterable) as IReadable<T>
}
