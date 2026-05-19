import { TransformStream } from "./system/stream.ts"

type LineChunk = string | Uint8Array

const decodeChunk = (chunk: LineChunk, decoder: TextDecoder): string =>
  typeof chunk === "string" ? chunk : decoder.decode(chunk, { stream: true })

/**
 * Splits a stream of text or bytes into a stream of lines. Lines are
 * separated by `\n`, with optional `\r` stripped. The terminator is not
 * included in the emitted line. A trailing line without a final newline is
 * emitted as the last chunk.
 *
 * @param readable A stream of string or Uint8Array chunks (interpreted as UTF-8)
 * @returns A stream of line strings
 *
 * @example for await (const line of lines(fileStream)) parseLine(line)
 */
export const lines = (readable: ReadableStream<LineChunk>): ReadableStream<string> => {
  const decoder = new TextDecoder()
  let buffer = ""
  let scanFrom = 0
  const transform = new TransformStream<LineChunk, string>({
    transform(chunk, controller) {
      buffer += decodeChunk(chunk, decoder)
      let start = 0
      for (let i = scanFrom; i < buffer.length; i++) {
        if (buffer[i] !== "\n") continue
        const end = i > 0 && buffer[i - 1] === "\r" ? i - 1 : i
        controller.enqueue(buffer.slice(start, end))
        start = i + 1
      }
      buffer = buffer.slice(start)
      scanFrom = buffer.length
    },
    flush(controller) {
      if (buffer) {
        controller.enqueue(buffer)
        buffer = ""
        scanFrom = 0
      }
    },
  })
  return readable.pipeThrough(transform)
}

/**
 * Like `lines()`, but treats `\n` characters inside double-quoted fields as
 * part of the field (RFC 4180 CSV semantics). Escaped quotes (`""`) are
 * supported.
 *
 * @param readable A stream of string or Uint8Array chunks (interpreted as UTF-8)
 * @returns A stream of CSV record strings (one per record, multi-line fields preserved)
 *
 * @example for await (const record of csvLines(fileStream)) parseCsvLine(record)
 */
export const csvLines = (readable: ReadableStream<LineChunk>): ReadableStream<string> => {
  const decoder = new TextDecoder()
  let buffer = ""
  let scanFrom = 0
  let inQuotes = false
  const transform = new TransformStream<LineChunk, string>({
    transform(chunk, controller) {
      buffer += decodeChunk(chunk, decoder)
      let start = 0
      for (let i = scanFrom; i < buffer.length; i++) {
        const ch = buffer[i]
        if (ch === `"`) {
          if (inQuotes && buffer[i + 1] === `"`) {
            i++
            continue
          }
          inQuotes = !inQuotes
          continue
        }
        if (ch !== "\n" || inQuotes) continue
        const end = i > 0 && buffer[i - 1] === "\r" ? i - 1 : i
        controller.enqueue(buffer.slice(start, end))
        start = i + 1
      }
      buffer = buffer.slice(start)
      scanFrom = buffer.length
    },
    flush(controller) {
      if (buffer) {
        controller.enqueue(buffer)
        buffer = ""
        scanFrom = 0
      }
    },
  })
  return readable.pipeThrough(transform)
}
