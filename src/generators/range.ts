import { createReadable } from "../createReadable.ts"

/**
 * Generate a numbers stream from given range
 *
 * @param min The minimum number
 * @param max The maximum number
 * @param step The step between each number
 * @returns A readable stream of numbers
 *
 * @example const readable = range(1, 10)
 * @example const readable = range(0, 4, 2)
 */
export const range = (min: number, max: number, step: number = 1): ReadableStream<number> => {
  return createReadable(rangeGen(min, max, step))
}

export function* rangeGen(min: number, max: number, step: number = 1) {
  if (min < max) {
    for (let i = min; i <= max; i += step) {
      yield i
    }
  } else {
    for (let i = min; i >= max; i += step) {
      yield i
    }
  }
}
