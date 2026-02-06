---
layout: default
title: Getting Started
---

# Getting Started

## Installation

### npm / yarn / pnpm / bun

```bash
npx jsr add @sgmonda/streamfu     # npm
yarn dlx jsr add @sgmonda/streamfu # yarn
pnpm dlx jsr add @sgmonda/streamfu # pnpm
bunx jsr add @sgmonda/streamfu     # bun
```

### Deno

```bash
deno add jsr:@sgmonda/streamfu
```

## Quick Start

```typescript
import { createReadable, filter, map, pipe, reduce } from "@sgmonda/streamfu"

// Create a stream from any iterable
const numbers = createReadable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

// Compose transformations with pipe
const stream = pipe(
  numbers,
  (r) => filter(r, (n) => n % 2 === 0), // keep even: 2, 4, 6, 8, 10
  (r) => map(r, (n) => n * 2), // double:   4, 8, 12, 16, 20
)

const sumOfDoubledEvens = await reduce(stream, (a, b) => a + b, 0) // 60
```

## Consuming vs Non-consuming

streamfu operations fall into two categories:

**Non-consuming** operations return a `ReadableStream`. The original stream is transformed but can still flow through additional operations:

- `map`, `filter`, `flat`, `flatMap`, `slice`, `splice`, `concat`, `zip`, `pipe`, `branch`, `createReadable`, `createWritable`

**Consuming** operations return a `Promise`. They read the stream to completion — it cannot be reused:

- `reduce`, `list`, `at`, `some`, `every`, `forEach`, `includes`, `indexOf`

> **Rule of thumb:** If it returns a `ReadableStream`, it's non-consuming. If it returns a `Promise`, it consumes the stream.

### Using branch() for multiple consumers

Need to consume a stream more than once? Use `branch()` first:

```typescript
import { branch, reduce } from "@sgmonda/streamfu"

const [forSum, forCount] = branch(numbers, 2)

const sum = await reduce(forSum, (a, b) => a + b, 0)
const count = await reduce(forCount, (acc) => acc + 1, 0)
```

## Error Handling

Errors propagate automatically through chained operations. If a `map()` transformer or a `filter()` predicate throws, the error bubbles up and rejects the promise returned by any consuming operation:

```typescript
import { createReadable, filter, list, map, pipe } from "@sgmonda/streamfu"

const stream = pipe(
  createReadable(data),
  (r) => map(r, transformFn), // if this throws...
  (r) => filter(r, predicateFn),
)

try {
  const results = await list(stream) // ...the error rejects here
} catch (err) {
  console.error("Something failed:", err)
}
```

No special error listeners, no extra plumbing. Errors flow naturally through the pipeline.
