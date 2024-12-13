/**
 * Flattens a stream of arrays.
 *
 * @param readable The readable stream to flatten
 * @param depth The depth level specifying how deep a nested array structure should be flattened
 * @returns A readable stream whose chunks are the flattened arrays
 *
 * @example const flatStream = flat(readable)
 * @example const flatStream = flat(readable, 2)
 */
export const flat = <T = unknown>(readable: ReadableStream<unknown>, depth: number = 1): ReadableStream<T> => {
  const transform = new TransformStream({
    transform: (chunk, controller) => {
      if (depth === 0) {
        controller.enqueue(chunk)
      } else {
        const flatChunk = Array.isArray(chunk) ? chunk.flat(depth - 1) : chunk
        for (const item of Array.isArray(flatChunk) ? flatChunk : [flatChunk]) {
          controller.enqueue(item)
        }
      }
    },
  })

  return readable.pipeThrough(transform)
}
