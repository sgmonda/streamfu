export const flat = (readable: ReadableStream<unknown>, depth: number = 1): ReadableStream<unknown> => {
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
