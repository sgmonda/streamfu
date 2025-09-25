type IReducer<Tin, Taccum> = (
  acc: Taccum,
  chunk: Tin,
  index: number,
) => Taccum | Promise<Taccum>

/**
 * Reduces a stream into a single value, using the given function. This is similar to the `Array.prototype.reduce` method.
 * NOTE: This consumes the stream so it can't be reused after calling this function.
 *
 * @param readable Stream to reduce
 * @param fn Function to apply to each chunk, returning the new accumulator value
 * @param initialValue Initial value of the accumulator
 * @returns The final accumulator value
 *
 * @example const sum = await reduce(numReadable, (acc, chunk) => acc + chunk, 0);
 * @example const concat = await reduce(strReadable, (acc, chunk) => acc + chunk, '');
 */
export const reduce = async <Tin = unknown, Taccum = unknown>(
  readable: ReadableStream<Tin>,
  fn: IReducer<Tin, Taccum>,
  initialValue: Taccum,
): Promise<Taccum> => {
  let acc = initialValue
  let index = 0
  const reader = readable.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) return acc
      acc = await fn(acc, value!, index++)
    }
  } finally {
    reader.releaseLock()
  }
}
