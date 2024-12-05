// deno-lint-ignore-file no-window no-process-globals

import { UnknownPlatformError } from "../errors.ts"

export enum PLATFORM {
  NODE = "node",
  DENO = "deno",
  BUN = "bun",
  WEB = "web",
}

export let platform: PLATFORM

//@ts-ignore Cross Runtime
if (typeof window !== "undefined" && typeof window.document !== "undefined") {
  platform = PLATFORM.WEB
  //@ts-ignore Cross Runtime
} else if (typeof Bun !== "undefined") {
  platform = PLATFORM.BUN
  throw new UnknownPlatformError() // TODO Support Bun once ReadableStream.from() is supported
} else if (typeof Deno !== "undefined") {
  platform = PLATFORM.DENO
} else if (typeof process !== "undefined" && process.versions?.node) {
  platform = PLATFORM.NODE
} else {
  throw new UnknownPlatformError()
}
