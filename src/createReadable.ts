type IReadable<T> = T extends Iterable<infer U> ? ReadableStream<U> : never

/**
 * Creates a readable stream from an iterable. Every item in the iterable will be a chunk in the stream.
 * This way you can pipe the stream, transform it, etc.
 * 
 * @param iterable Anything that is iterable, like an array, a generator, a string, etc.
 * @returns A readable stream
 * @example const numsStream = streamize([1, 2, 3, 4, 5]);
 */
export const createReadable = <T extends Iterable<unknown> | AsyncIterable<unknown>>(iterable: T): IReadable<T> => {
    return ReadableStream.from(iterable) as IReadable<T>;
}
