---
layout: default
title: Design Principles
---

# Design Principles

streamfu is built on five core principles that guide every design decision.

---

## Functional & Pure

Every operation in streamfu is a pure function. No side effects, no mutations. Each transformation returns a **new stream**, leaving the original untouched.

```typescript
// Every operation creates a new stream — the original is never modified
const original = createReadable([1, 2, 3, 4, 5])
const filtered = filter(original, (n) => n > 2) // new stream
const doubled = map(filtered, (n) => n * 2) // another new stream
```

This makes your code predictable and easy to reason about. You can compose operations freely without worrying about hidden state changes.

---

## Familiar API

If you know `Array.prototype`, you already know streamfu. Every function name, parameter order, and behavior mirrors its array counterpart:

| Array Method                       | streamfu Equivalent                  |
| ---------------------------------- | ------------------------------------ |
| `array.map(fn)`                    | `map(stream, fn)`                    |
| `array.filter(fn)`                 | `filter(stream, fn)`                 |
| `array.reduce(fn, init)`           | `reduce(stream, fn, init)`           |
| `array.flat(depth)`                | `flat(stream, depth)`                |
| `array.flatMap(fn)`                | `flatMap(stream, fn)`                |
| `array.slice(start, end)`          | `slice(stream, start, end)`          |
| `array.splice(start, n, ...items)` | `splice(stream, start, n, ...items)` |
| `array.at(index)`                  | `at(stream, index)`                  |
| `array.some(fn)`                   | `some(stream, fn)`                   |
| `array.every(fn)`                  | `every(stream, fn)`                  |
| `array.includes(value)`            | `includes(stream, value)`            |
| `array.indexOf(value)`             | `indexOf(stream, value)`             |
| `array.forEach(fn)`                | `forEach(stream, fn)`                |

The only difference: the stream is always the first argument instead of `this`. Zero learning curve.

---

## Universal

streamfu is built on the [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), a standard that's supported across all modern JavaScript runtimes:

- **Deno** — native support
- **Node.js** — supported since v16+ via `node:stream/web`
- **Bun** — native support
- **Browsers** — all modern browsers
- **Cloudflare Workers** — native support

streamfu includes a platform abstraction layer that normalizes stream imports across runtimes, so you write code once and it runs everywhere.

---

## Type-safe

Full TypeScript support with precise generics. Types flow through every operation:

```typescript
const stream: ReadableStream<number> = createReadable([1, 2, 3])

// Type is inferred through the entire chain
const result: ReadableStream<string> = pipe(
  stream,
  (r) => filter(r, (n) => n > 1), // ReadableStream<number>
  (r) => map(r, (n) => n * 2), // ReadableStream<number>
  (r) => map(r, (n) => `Value: ${n}`), // ReadableStream<string>
)
```

`map()` and `pipe()` use TypeScript function overloads (up to 9 chained transforms) to provide full type inference through transformation chains. No `any`, no type assertions needed.

---

## 100% Tested

Every function is tested. Every edge case is covered. Coverage is enforced in CI — the test suite runs automatically on every pull request and must maintain 100% coverage.

Tests are colocated with their source files (`src/foo.ts` → `src/foo.test.ts`) and follow a data-driven pattern for clarity and completeness.

The project is tested across multiple runtimes:

- Deno (primary)
- Node.js (npm, yarn, pnpm)
- Bun
- Cloudflare Workers
