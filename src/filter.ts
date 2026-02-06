/**
 * Filter stream chunks based on a predicate function.
 *
 * @param fn The predicate function, that will be applied to each chunk. If the function returns `true`, the chunk will be passed through.
 * @returns A readable stream whose chunks are the ones that passed the predicate function
 *
 * @example const onlyEven = filter<number>(num => num % 2 === 0);
 * @example const onlyStrings = filter<string>(item => typeof item === 'string');
 * @example const onlyPositive = filter<number>(num => num > 0);
 */
export const filter = <T>(
  readable: ReadableStream<T>,
  fn: (chunk: T) => boolean | Promise<boolean>,
): ReadableStream<T> => {
  const ts = new TransformStream<T, T>({
    transform: async (chunk, controller) => {
      try {
        if (await fn(chunk)) controller.enqueue(chunk)
      } catch (e) {
        controller.error(e)
      }
    },
  })
  readable.pipeTo(ts.writable).catch(() => {})
  return ts.readable
}
