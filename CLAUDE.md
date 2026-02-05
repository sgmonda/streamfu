# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Streamfu is a TypeScript library providing pure functional utilities for working with Web Streams (`ReadableStream`). It mirrors familiar `Array.prototype` methods (map, filter, reduce, etc.) but operates on streams. Published to JSR as `@sgmonda/streamfu`. Supports Deno, Node.js, Bun, and browsers.

## Commands

**Run all checks + tests + coverage (the full CI pipeline locally):**

```bash
deno task test
```

This runs type-checking, formatting/linting, unit tests, cross-runtime example tests, and coverage report (100% required, excluding `src/system` and `examples`).

**Individual tasks:**

```bash
deno task check          # Type-check all TypeScript files
deno task lint           # Format (deno fmt) and lint (deno lint)
deno test src/map.ts.test.ts --allow-all   # Run a single test file
```

**Cross-runtime example tests:**

```bash
deno task test:examples:node   # Tests with npm, yarn, pnpm
deno task test:examples:bun    # Tests with Bun
```

## Architecture

### Two Categories of Stream Operations

All exports live in `src/` with a 1:1 mapping between operator and file. Each file has a co-located `.test.ts` file.

**Non-consuming operators** — take a `ReadableStream<T>`, return a new `ReadableStream<U>` (chainable):
`map`, `filter`, `flat`, `flatMap`, `slice`, `splice`, `concat`, `zip`, `branch`

These use the `TransformStream` + `pipeThrough` pattern:

```typescript
readable.pipeThrough(new TransformStream({ transform(chunk, controller) { ... } }))
```

**Consuming operators** — take a `ReadableStream<T>`, return a `Promise<U>` (terminal, stream cannot be reused):
`reduce`, `list`, `some`, `every`, `at`, `includes`, `indexOf`

These use `getReader()` to consume the stream.

### Composition

`pipe(readable, ...fns)` chains operations: each function receives the previous stream and returns a new one. This is the primary way to build processing pipelines.

`branch(readable, n)` clones a stream into `n` independent copies using `.tee()`, enabling multiple consumers. The original stream becomes locked.

### Cross-Runtime Abstraction (`src/system/`)

- `platform.ts` — detects runtime (Deno, Node, Bun, browser) via global checks
- `stream.ts` — re-exports `ReadableStream`, `WritableStream`, `TransformStream` from the correct runtime source (Node requires `node:stream/web` via `require()`)

All operator files import stream classes from `src/system/stream.ts`, not from globals directly.

Bun lacks `ReadableStream.from()`, so `createReadable.ts` includes a polyfill using `ReadableStream` constructor with `start()`.

### Entry Point

`mod.ts` is the barrel file. Unimplemented operators (join, keys, lastIndexOf, pop, push, shift, with) are commented out as TODOs.

## Code Style

- Deno formatter: 2-space indent, no semicolons, double quotes, 120-char line width
- Deno linter: "fresh" and "recommended" rule tags
- All exported functions require JSDoc with `@param`, `@returns`, and `@example` tags
- Transform functions accept both sync and async callbacks

## CI/CD

- **PRs**: GitHub Actions runs `deno task test` (Deno v2, Node 20, Bun latest)
- **Merge to main**: runs tests, then publishes to JSR via `npx jsr publish`
