/**
 * Passes a readable stream through a series of functions, each taking the previous output as input, and returning a new readable stream for the next
 *
 * @param readable A readable stream to be passed to the first function
 * @param fns A list of functions, each taking a readable stream and returning a new readable stream
 * @returns The last readable stream after applying all transformations
 *
 * @example const result = pipe(readable, r => filter(r, num => num % 2 === 0), r => map(r, num => num.toString()))
 */
export const pipe = <T extends (readable: ReadableStream, ...args: unknown[]) => ReadableStream, Tout = unknown>(
  readable: ReadableStream,
  ...fns: T[]
): ReadableStream<Tout> => {
  return fns.reduce((prev, fn) => fn(prev), readable)
}
