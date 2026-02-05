# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Streamfu is a functional programming library providing array-like utilities for the Web Streams API. It makes streams composable and declarative, mirroring `Array.prototype` methods (map, filter, reduce, pipe, etc.). Published on JSR as `@sgmonda/streamfu`.

Multi-runtime: works on Deno (primary), Node.js, Bun, browsers, and Cloudflare Workers.

## Commands

```bash
deno task check          # Type-check all TypeScript files
deno task lint           # Format (deno fmt) + lint
deno task test           # Full suite: type-check → lint → unit tests with coverage → example tests → coverage report
```

Run a single test file directly:

```bash
deno test --allow-all src/map.test.ts
```

The `test` task has `check` and `lint` as dependencies — they run automatically before tests.

Coverage excludes `src/system/` and `examples/`. The project maintains 100% coverage.

## Architecture

**Entry point**: `mod.ts` re-exports all public functions from `src/`.

**Two categories of operations**:

- **Non-consuming** (return `ReadableStream`): `map`, `filter`, `flat`, `flatMap`, `slice`, `splice`, `concat`, `zip`, `branch`, `pipe`, `createReadable`, `createWritable`
- **Consuming** (return `Promise<T>`): `reduce`, `list`, `at`, `some`, `every`, `includes`, `indexOf`, `forEach`

**Platform abstraction** (`src/system/`):

- `platform.ts` — runtime detection (Deno/Node/Bun/Web/Cloudflare) via feature detection
- `stream.ts` — normalizes Stream API imports across runtimes (Node requires `node:stream/web`)

**Generators** (`src/generators/`): `range()` for numeric sequences, `words()` for random strings.

**Composition**: `pipe()` chains operations via functional reduce. All operations are pure functions with no mutations and support async callbacks.

## Code Style

Enforced by `deno fmt` configuration in `deno.json`:

- No semicolons
- Double quotes
- 2-space indentation (no tabs)
- 120-char line width

Lint rules: `fresh` + `recommended` tags.

## Testing Patterns

Tests are colocated: `src/foo.ts` → `src/foo.test.ts`. They use Deno's native test runner with `@std/assert`.

Tests follow a data-driven pattern:

```typescript
const TEST_CASES = [{ title: "...", conditions: { ... }, expected: { ... } }]

Deno.test("functionName()", async ({ step }) => {
  for (const tc of TEST_CASES) {
    await step(tc.title, async () => { /* assertions */ })
  }
})
```

## Key Type Conventions

- `IReadable<T>` — typed alias for `ReadableStream<T>`
- `ITuple<T>` — maps `ReadableStream[]` types to value tuple types (used by `zip`)
- Custom errors extend `StreamFuError` (defined in `src/errors.ts`)
- Heavy use of generics for type inference through transformation chains

## Publishing

CI publishes to JSR automatically on push to `main` (via `.github/workflows/publish.yml`) after tests pass. Version is in `deno.json`.
