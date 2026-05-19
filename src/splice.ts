import { TransformStream } from "./system/stream.ts"

/**
 * Mirrors `Array.prototype.splice`: removes `replaced` items starting at `start`
 * and inserts `newItems` at that position. If `start` is greater than or equal
 * to the stream length, items are appended at the end (matching how
 * `Array.prototype.splice` clamps `start` to `length`).
 *
 * Unlike `Array.prototype.splice`, this function does not return the removed
 * items — it returns a new readable stream with the modified sequence.
 *
 * @param readable The readable stream to splice
 * @param start The index at which to start replacing items from the stream
 * @param replaced The number of items to remove from the stream
 * @param newItems The items to insert into the stream
 * @returns A readable stream with the items removed and/or inserted
 *
 * @example const oneless = splice(readable, 2, 1)
 * @example const spliced = splice(readable, 2, 1, 'a', 'b', 'c')
 * @example const inserted = splice(readable, 2, 0, 'a', 'b') // insert without removing
 * @example const appended = splice(readable, 999, 0, 'x') // start beyond length: append
 */
export const splice = <T>(
  readable: ReadableStream<T>,
  start: number,
  replaced: number,
  ...newItems: T[]
): ReadableStream<T> => {
  let index = 0
  let inserted = false
  const enqueueNewItems = (controller: TransformStreamDefaultController<T>) => {
    for (const item of newItems) controller.enqueue(item)
    inserted = true
  }
  const transform = new TransformStream<T, T>({
    transform: (chunk, controller) => {
      if (index === start && !inserted) enqueueNewItems(controller)
      if (index < start || index >= start + replaced) controller.enqueue(chunk)
      index++
    },
    flush: (controller) => {
      if (!inserted) enqueueNewItems(controller)
    },
  })
  return readable.pipeThrough(transform)
}
