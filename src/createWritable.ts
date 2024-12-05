/**
 * Creates a writable stream from a given write function. Every chunk written to the stream will be passed to the function.
 *
 * @param fn The write function, that will be called for each chunk written to the stream
 * @returns A writable stream
 *
 * @example const logStream = createWritable(console.log);
 */
export const createWritable = <T>(fn: (chunk: T) => void | Promise<void>): WritableStream<T> => {
  return new WritableStream<T>({ write: fn })
}
