/**
 * Branches a stream many times. This is very useful when using stuff that consumes streams, like `at()` or `reduce()`.
 * Using a cloned streams allows you to use data from the original stream multiple times at different rates.
 * NOTE: The original stream will be locked so you should not use it after teeing.
 *
 * @param readable A stream to branch
 * @param n Number of branches to create
 * @returns A branches list of streams
 */
export const branch = <T>(
  readable: ReadableStream<T>,
  n: number,
): ReadableStream<T>[] => {
  if (n < 1) {
    throw new RangeError("n must be >= 1")
  }
  if (readable.locked) {
    throw new TypeError("Cannot tee a locked ReadableStream.")
  }
  const out: ReadableStream<T>[] = []
  let s = readable
  for (let i = 0; i < n - 1; i++) {
    const [a, b] = s.tee()
    out.push(a)
    s = b
  }
  out.push(s)
  return out
}
