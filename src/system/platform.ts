import process from "node:process"
import { UnknownPlatformError } from "../errors.ts"

export enum PLATFORM {
  NODE = "node",
  DENO = "deno",
  BUN = "bun",
  WEB = "web",
  CLOUDFLARE = "cloudflare",
}

export let platform: PLATFORM

//@ts-ignore Cross Runtime
// deno-lint-ignore no-window
if (typeof window !== "undefined" && typeof window.document !== "undefined") {
  platform = PLATFORM.WEB
  //@ts-ignore Cross Runtime
} else if (typeof Bun !== "undefined") {
  platform = PLATFORM.BUN
} else if (typeof Deno !== "undefined") {
  platform = PLATFORM.DENO
  //@ts-ignore Cross Runtime
} else if (typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers") {
  platform = PLATFORM.CLOUDFLARE
} else if (typeof process !== "undefined" && process.versions?.node) {
  platform = PLATFORM.NODE
} else {
  throw new UnknownPlatformError()
}
