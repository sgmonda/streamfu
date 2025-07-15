import { TeeBuffer } from "./teeBuffer"

export function cloneIterable<T>(
  iterable: Iterable<T>,
  copies: number,
): Iterable<T>[] {
  const buffer = new TeeBuffer<T>(iterable, copies)
  return Array.from({ length: copies }, (_, i) => buffer.makeIterator(i))
}
