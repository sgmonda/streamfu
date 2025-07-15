import { AsyncTeeBuffer } from "./teeBufferAsync"

export function cloneAsyncIterable<T>(
  iterable: AsyncIterable<T>,
  copies: number,
): AsyncIterable<T>[] {
  const buffer = new AsyncTeeBuffer<T>(iterable, copies)
  return Array.from({ length: copies }, (_, i) => buffer.makeAsyncIterator(i))
}
