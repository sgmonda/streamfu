// deno-lint-ignore-file no-window no-window-prefix

import { PLATFORM, platform } from "./platform.ts"

export let ReadableStream: typeof globalThis.ReadableStream
export let WritableStream: typeof globalThis.WritableStream
export let TransformStream: typeof globalThis.TransformStream

if (platform === PLATFORM.DENO) {
  ReadableStream = globalThis.ReadableStream
  WritableStream = globalThis.WritableStream
  TransformStream = globalThis.TransformStream
} else if (platform === PLATFORM.WEB) {
  //@ts-ignore Cross Runtime
  ReadableStream = window.ReadableStream
  //@ts-ignore Cross Runtime
  WritableStream = window.WritableStream
  //@ts-ignore Cross Runtime
  TransformStream = window.TransformStream
} else if (platform === PLATFORM.BUN) {
  ReadableStream = globalThis.ReadableStream
  WritableStream = globalThis.WritableStream
  TransformStream = globalThis.TransformStream
} else if (platform === PLATFORM.CLOUDFLARE) {
  ReadableStream = globalThis.ReadableStream
  WritableStream = globalThis.WritableStream
  TransformStream = globalThis.TransformStream
} else if (platform === PLATFORM.NODE) {
  // Node 18+ exposes Web Streams on globalThis. We use those instead of
  // `require("node:stream/web")` so the same module works in both CJS and
  // ESM builds emitted by dnt (the literal `require` would fail in ESM).
  // Older Node versions are not supported.
  ReadableStream = globalThis.ReadableStream
  WritableStream = globalThis.WritableStream
  TransformStream = globalThis.TransformStream
}
