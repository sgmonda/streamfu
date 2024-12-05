abstract class StreamFuError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "StreamFuError"
  }
}

export class UnknownPlatformError extends StreamFuError {
  constructor() {
    super("Unknown platform. Supported platforms are: Node.js, Deno, Browser, and Bun")
  }
}
