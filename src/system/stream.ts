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
  // //@ts-ignore Cross Runtime
  // const streamsModule = await import("node:stream/web")
  // //@ts-ignore Cross Runtime
  // ReadableStream = streamsModule.ReadableStream
  // //@ts-ignore Cross Runtime
  // WritableStream = streamsModule.WritableStream
  // //@ts-ignore Cross Runtime
  // TransformStream = streamsModule.TransformStream
} else if (platform === PLATFORM.NODE) {
  const streamsModule = require("node:stream/web")

  //@ts-ignore Cross Runtime
  ReadableStream = streamsModule.ReadableStream
  //@ts-ignore Cross Runtime
  WritableStream = streamsModule.WritableStream
  //@ts-ignore Cross Runtime
  TransformStream = streamsModule.TransformStream
}
