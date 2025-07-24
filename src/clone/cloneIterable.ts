import { teeIterable } from "./teeBuffer.ts"

export function cloneIterable<T>(
  iterable: Iterable<T>,
  copies: number,
): Iterable<T>[] {
  return teeIterable(iterable, copies)
}
