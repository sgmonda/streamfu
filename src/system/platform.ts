import process from "node:process"
import { UnknownPlatformError } from "../errors.ts"

export enum PLATFORM {
  NODE = "node",
  DENO = "deno",
  BUN = "bun",
  WEB = "web",
}

export let platform: PLATFORM

//@ts-ignore Cross Runtime
// deno-lint-ignore no-window
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
