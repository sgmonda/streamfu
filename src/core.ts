import { platform, PLATFORM } from "./platform.ts";

console.log('PLATFORM:', platform);

export let ReadableStream: typeof globalThis.ReadableStream;
export let WritableStream: typeof globalThis.WritableStream;
export let TransformStream: typeof globalThis.TransformStream;

if (platform === PLATFORM.DENO) {
  ReadableStream = globalThis.ReadableStream;
  WritableStream = globalThis.WritableStream;
  TransformStream = globalThis.TransformStream;
} else if (platform === PLATFORM.WEB) {
  //@ts-ignore Cross Runtime
  ReadableStream = window.ReadableStream;
  //@ts-ignore Cross Runtime
  WritableStream = window.WritableStream;
  //@ts-ignore Cross Runtime
  TransformStream = window.TransformStream;
} else if (platform === PLATFORM.BUN || platform === PLATFORM.NODE) {
  const streamsModule = await import("node:stream/web");
  //@ts-ignore Cross Runtime
  ReadableStream = streamsModule.ReadableStream;
  //@ts-ignore Cross Runtime
  WritableStream = streamsModule.WritableStream;
  //@ts-ignore Cross Runtime
  TransformStream = streamsModule.TransformStream;
} 
