import { createReadable } from "../createReadable.ts"

type Producer<T> = (i: number) => T | null | Promise<T | null>

async function* iterateGen<T>(producer: Producer<T>): AsyncGenerator<T> {
  for (let i = 0;; i++) {
    const value = await producer(i)
    if (value === null) return
    yield value
  }
}

/**
 * Builds a stream by repeatedly invoking a producer function until it
 * returns `null`. The producer receives a zero-based call index and may
 * return values or promises. `null` is the only sentinel that terminates
 * the stream; `0`, empty strings, and `undefined` are emitted as values.
 *
 * Useful for paginated APIs, polling, or any generator-like sequence where
 * the stop condition is dynamic.
 *
 * @param producer A function returning the next chunk, or `null` to stop
 * @returns A readable stream of the produced values
 *
 * @example const pages = iterate(async (i) => {
 *   const page = await fetchPage(i)
 *   return page.items.length ? page : null
 * })
 */
export const iterate = <T>(producer: Producer<T>): ReadableStream<T> =>
  createReadable(iterateGen(producer)) as ReadableStream<T>
