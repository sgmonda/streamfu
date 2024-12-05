type IReducer<Tin, Taccum> = (acc: Taccum, chunk: Tin, index: number) => Taccum | Promise<Taccum>

/**
 * Reduces a stream into a single value, using the given function. This is similar to the `Array.prototype.reduce` method.
 *
 * @param readable Stream to reduce
 * @param fn Function to apply to each chunk, returning the new accumulator value
 * @param initialValue Initial value of the accumulator
 * @returns The final accumulator value
 *
 * @example const sum = await reduce(numReadable, (acc, chunk) => acc + chunk, 0);
 * @example const concat = await reduce(strReadable, (acc, chunk) => acc + chunk, '');
 */
export const reduce = <Tin = unknown, Taccum = unknown>(
  readable: ReadableStream<Tin>,
  fn: IReducer<Tin, Taccum>,
  initialValue: Taccum,
): Promise<Taccum> => {
  let acc: Taccum = initialValue
  const reader = readable.getReader()
  return new Promise((resolve, reject) => {
    let index = 0
    reader.read().then(async function process({ done, value }): Promise<void> {
      if (done) return resolve(acc)
      try {
        acc = await fn(acc, value, index++)
        reader.read().then(process)
      } catch (err: unknown) {
        reject(err)
        return
      }
    })
  })
}
