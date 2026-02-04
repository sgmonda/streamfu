<div align="center">

<img width="150" height="100" alt="header" src="https://github.com/user-attachments/assets/bbbff16f-cd63-45db-890b-170aba10f643" />

# streamfu

### Streams should feel like arrays. Now they do.

[![JSR Score](https://jsr.io/badges/@sgmonda/streamfu/score)](https://jsr.io/@sgmonda/streamfu)
[![JSR Version](https://jsr.io/badges/@sgmonda/streamfu)](https://jsr.io/@sgmonda/streamfu)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![100% Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)]()

Functional stream utilities for JavaScript & TypeScript

[Getting Started](#getting-started) · [API](#api-reference) · [Why streamfu?](#why-streamfu) · [Contributing](#contributing)

</div>

---

## Why streamfu?

Streams are one of the most powerful primitives in JavaScript. They handle infinite data, backpressure, and async flows — things arrays simply can't do.

But the standard API makes you pay for that power with **boilerplate, footguns, and unreadable code**.

### The problem: Native streams are painful

Here's a real scenario — read a stream of numbers, keep only even ones, double them, and collect the results:

```typescript
// ❌ Native Web Streams — imperative, verbose, error-prone
const reader = readable.getReader()
const results: number[] = []

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  if (value % 2 === 0) {
    results.push(value * 2)
  }
}

reader.releaseLock()
```

Manual reader management. Mutable state. An infinite `while (true)` loop. And this is the **simple** case.

Need to split a stream? Native `tee()` only gives you two copies. Want to merge streams? Build your own. Want to zip? Good luck.

```typescript
// ❌ Native — splitting a stream into 4 branches
const [a, rest1] = stream.tee()
const [b, rest2] = rest1.tee()
const [c, d] = rest2.tee()
// Hope you got the order right...
```

### The solution: streamfu

```typescript
// ✅ streamfu — declarative, composable, readable
import { createReadable, pipe, filter, map, list } from "@sgmonda/streamfu"

const readable = createReadable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

const stream = pipe(
  readable,
  r => filter(r, n => n % 2 === 0),
  r => map(r, n => n * 2),
)
const results = await list(stream)
```

Same result. No manual readers. No mutable state. No `while (true)`. Just pure transformations.

```typescript
// ✅ streamfu — branch into any number of copies
import { branch } from "@sgmonda/streamfu"

const [a, b, c, d] = branch(stream, 4)
```

### Side-by-side comparison

| Task | Native Streams | streamfu |
|------|---------------|----------|
| Transform each chunk | `pipeThrough(new TransformStream({...}))` | `map(stream, fn)` |
| Filter chunks | Manual reader loop + condition | `filter(stream, fn)` |
| Reduce to value | Manual reader loop + accumulator | `reduce(stream, fn, init)` |
| Combine streams | Manual reader orchestration | `zip(s1, s2, s3)` |
| Concatenate streams | Complex async pull logic | `concat(s1, s2, s3)` |
| Split stream | Nested `.tee()` chains | `branch(stream, n)` |
| Get element at index | Manual counter + reader | `at(stream, i)` |
| Check if value exists | Manual loop + early exit | `includes(stream, val)` |
| Chain operations | Deeply nested `pipeThrough` | `pipe(stream, f1, f2, f3)` |

**If you know `Array.prototype`, you already know streamfu.**

---

## Getting Started

### Install

<details open>
  <summary><strong>npm / yarn / pnpm / bun</strong></summary>

```bash
npx jsr add @sgmonda/streamfu     # npm
yarn dlx jsr add @sgmonda/streamfu # yarn
pnpm dlx jsr add @sgmonda/streamfu # pnpm
bunx jsr add @sgmonda/streamfu     # bun
```
</details>

<details>
  <summary><strong>Deno</strong></summary>

```bash
deno add jsr:@sgmonda/streamfu
```
</details>

### Quick start

```typescript
import { createReadable, map, filter, reduce, pipe } from "@sgmonda/streamfu"

// Create a stream from any iterable
const numbers = createReadable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

// Compose transformations with pipe
const stream = pipe(
  numbers,
  r => filter(r, n => n % 2 === 0),  // keep even: 2, 4, 6, 8, 10
  r => map(r, n => n * 2),           // double:   4, 8, 12, 16, 20
)
const sumOfDoubledEvens = await reduce(stream, (a, b) => a + b, 0) // sum: 60

console.log(sumOfDoubledEvens) // 60
```

---

## API Reference

### Stream creation

| Function | Description |
|----------|-------------|
| `createReadable(iterable)` | Create a stream from arrays, generators, sets, strings — any iterable |
| `createWritable(fn)` | Create a writable stream from a callback function |
| `range(min, max, step?)` | Generate a stream of numbers in a range |
| `words(chars, length)` | Generate a stream of random strings |

### Transformations (non-consuming)

These return a **new stream** — the original is not consumed.

| Function | Description |
|----------|-------------|
| `map(stream, ...fns)` | Transform each chunk (supports chaining multiple transforms) |
| `filter(stream, fn)` | Keep only chunks matching a predicate |
| `flat(stream, depth?)` | Flatten a stream of arrays |
| `flatMap(stream, fn)` | Map + flatten in one step |
| `slice(stream, start, end?)` | Extract a portion of the stream |
| `splice(stream, start, count, ...items)` | Remove/insert chunks at a position |
| `concat(...streams)` | Concatenate multiple streams sequentially |
| `zip(...streams)` | Combine streams into a stream of tuples |
| `pipe(stream, ...fns)` | Chain multiple stream operations |
| `branch(stream, n)` | Split a stream into `n` independent copies |

### Consumers (consuming)

These **consume the stream** — it cannot be reused afterward.

| Function | Description |
|----------|-------------|
| `reduce(stream, fn, init)` | Reduce to a single value |
| `list(stream)` | Collect all chunks into an array |
| `some(stream, fn)` | Check if any chunk matches |
| `every(stream, fn)` | Check if all chunks match |
| `includes(stream, value)` | Check if a value exists in the stream |
| `at(stream, index)` | Get the chunk at a specific index |
| `indexOf(stream, value)` | Find the index of a value |

### Consuming vs non-consuming

> **Rule of thumb:** If it returns a `ReadableStream`, it's non-consuming. If it returns a `Promise`, it consumes the stream.

Need to consume a stream multiple times? Use `branch()` first:

```typescript
const [forSum, forCount] = branch(numbers, 2)

const sum = await reduce(forSum, (a, b) => a + b, 0)
const count = await reduce(forCount, (acc) => acc + 1, 0)
```

---

## Real-world examples

### Process a large CSV stream

```typescript
import { pipe, map, filter, createWritable } from "@sgmonda/streamfu"

const output = pipe(
  csvStream,
  r => map(r, line => line.split(",")),
  r => filter(r, cols => cols[2] !== "inactive"),
  r => map(r, cols => ({ name: cols[0], email: cols[1], status: cols[2] })),
)

await output.pipeTo(createWritable(user => db.insert(user)))
```

### Generate and transform numeric ranges

```typescript
import { range, pipe, map, filter, list } from "@sgmonda/streamfu"

const stream = pipe(
  range(2, 1000),
  r => filter(r, isPrime),
  r => map(r, n => n ** 2),
)
const primeSquares = await list(stream)
```

### Zip parallel data sources

```typescript
import { zip, map, list } from "@sgmonda/streamfu"

const paired = zip(namesStream, scoresStream)
// Stream of [name, score] tuples

const stream = pipe(
  paired,
  r => map(r, ([name, score]) => `${name}: ${score}`),
)
const leaderboard = await list(stream)
```

---

## Design principles

- **Functional & pure** — No side effects, no mutations. Every operation returns a new stream.
- **Familiar API** — Mirrors `Array.prototype` methods. Zero learning curve.
- **Universal** — Built on the [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Works in Node.js, Deno, Bun, and browsers.
- **Type-safe** — Full TypeScript support with precise generics.
- **Tested** — 100% code coverage. Every function, every edge case.

---

## Contributing

Contributions welcome! Fork the repo, make your changes, and submit a PR.

```bash
deno task test
```

**Requirements:**
- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- Maintain 100% test coverage
- Include JSDoc comments on all exports

### Publishing

Published to [JSR](https://jsr.io/@sgmonda/streamfu) automatically via GitHub CI when `version` changes in `deno.json` on `main`.

---

<div align="center">

**MIT License** · Made with care by [@sgmonda](https://github.com/sgmonda) and contributors

</div>
