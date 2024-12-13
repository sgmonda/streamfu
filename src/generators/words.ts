import { createReadable } from "../createReadable.ts"

/**
 * Generate a strings stream from given word length
 *
 * @param chars The number of characters in each word
 * @param length The number of words to generate
 *
 * @example const readable = words(5, 10)
 */
export const words = (chars: number, length: number): ReadableStream<string> => {
  return createReadable(wordsGen(chars, length))
}

export function* wordsGen(chars: number, length: number): Generator<string> {
  for (let i = 0; i < length; i += 1) {
    yield genRandomWord(chars)
  }
}

const genRandomWord = (length: number): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let res = ""
  for (let i = 0; i < length; i++) {
    res += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return res
}
