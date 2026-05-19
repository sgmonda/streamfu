/**
 * Consumes a stream of binary chunks (string or Uint8Array) and returns a
 * single Uint8Array with their concatenation. Strings are encoded as UTF-8.
 *
 * NOTE: This consumes the stream so it can't be reused after calling this
 * function.
 *
 * The result is a runtime-neutral `Uint8Array`. In Node, `Buffer.from(result)`
 * (or just `result` directly, since Buffer extends Uint8Array) gives you a
 * Buffer at zero cost.
 *
 * @param readable A stream of `Uint8Array | string` chunks
 * @returns A promise resolving to the concatenated bytes
 *
 * @example const bytes = await toBuffer(fileStream)
 * @example const text = new TextDecoder().decode(await toBuffer(csvStream))
 */
export const toBuffer = async (readable: ReadableStream<Uint8Array | string>): Promise<Uint8Array> => {
  const encoder = new TextEncoder()
  const chunks: Uint8Array[] = []
  let total = 0
  for await (const chunk of readable) {
    const bytes = typeof chunk === "string" ? encoder.encode(chunk) : chunk
    chunks.push(bytes)
    total += bytes.byteLength
  }
  const out = new Uint8Array(total)
  let offset = 0
  for (const c of chunks) {
    out.set(c, offset)
    offset += c.byteLength
  }
  return out
}
