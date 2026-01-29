# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Streamfu (`@sgmonda/streamfu`) is a functional utility library for Web Streams API, supporting Deno, Node.js, Bun, and browsers. Published to JSR (JavaScript Registry).

## Commands

All commands use Deno tasks defined in `deno.json`:

- **Type check:** `deno task check`
- **Format + lint:** `deno task lint`
- **Full test suite (includes check, lint, coverage):** `deno task test`
- **Run a single test file:** `deno test --allow-all src/map.test.ts`
- **Run examples:** `deno task test:examples`

Tests require 100% code coverage (excluding `src/system/` and `examples/`).

## Architecture

**Entry point:** `mod.ts` — re-exports all public API from `src/`.

**`src/system/`** — Platform abstraction layer:

- `platform.ts`: Runtime detection (Node/Deno/Bun/Web)
- `stream.ts`: Cross-runtime `ReadableStream`/`WritableStream`/`TransformStream` imports (Node needs `node:stream/web`)

**`src/*.ts`** — Each utility is a single file with a co-located `*.test.ts`. Two patterns:

1. **Non-consuming** (return `ReadableStream`): Use `TransformStream` + `pipeThrough`. Examples: `map`, `filter`, `flat`, `concat`, `zip`, `slice`, `splice`, `branch`.
2. **Consuming** (return `Promise`): Use `getReader()` + manual read loop. Examples: `reduce`, `list`, `some`, `every`, `includes`, `indexOf`, `at`.

**`src/generators/`** — Stream factories: `range()`, `words()`.

**Utilities:** `pipe()` composes transformations, `createReadable()` converts iterables to streams (includes `ReadableStream.from()` polyfill for Bun), `createWritable()` wraps write callbacks, `throttle()` batches factory calls.

## Test Patterns

Uses Deno's native test runner with parameterized test cases:

```typescript
const TEST_CASES = [{ title, conditions, expected }, ...]
Deno.test("fn()", async ({ step }) => {
  for (const tc of TEST_CASES) await runTest(tc)
  async function runTest({ title, conditions, expected }) {
    await step(title, async () => { /* assertions */ })
  }
})
```

Import `assertEquals` from `asserts` (mapped in import map). Use `createReadable()` and `list()` as test helpers to create/consume streams.

## Code Style

- Deno fmt: 2 spaces, no semicolons, double quotes, 120 char line width
- Conventional Commits for commit messages
- All exported functions have JSDoc documentation
