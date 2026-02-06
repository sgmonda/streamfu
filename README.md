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
import { createReadable, filter, list, map, pipe } from "@sgmonda/streamfu"

const readable = createReadable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

const stream = pipe(
  readable,
  (r) => filter(r, (n) => n % 2 === 0),
  (r) => map(r, (n) => n * 2),
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

| Task                  | Native Streams                            | streamfu                   |
| --------------------- | ----------------------------------------- | -------------------------- |
| Transform each chunk  | `pipeThrough(new TransformStream({...}))` | `map(stream, fn)`          |
| Filter chunks         | Manual reader loop + condition            | `filter(stream, fn)`       |
| Reduce to value       | Manual reader loop + accumulator          | `reduce(stream, fn, init)` |
| Combine streams       | Manual reader orchestration               | `zip(s1, s2, s3)`          |
| Concatenate streams   | Complex async pull logic                  | `concat(s1, s2, s3)`       |
| Split stream          | Nested `.tee()` chains                    | `branch(stream, n)`        |
| Get element at index  | Manual counter + reader                   | `at(stream, i)`            |
| Check if value exists | Manual loop + early exit                  | `includes(stream, val)`    |
| Chain operations      | Deeply nested `pipeThrough`               | `pipe(stream, f1, f2, f3)` |

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
import { createReadable, filter, map, pipe, reduce } from "@sgmonda/streamfu"

// Create a stream from any iterable
const numbers = createReadable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

// Compose transformations with pipe
const stream = pipe(
  numbers,
  (r) => filter(r, (n) => n % 2 === 0), // keep even: 2, 4, 6, 8, 10
  (r) => map(r, (n) => n * 2), // double:   4, 8, 12, 16, 20
)
const sumOfDoubledEvens = await reduce(stream, (a, b) => a + b, 0) // sum: 60

console.log(sumOfDoubledEvens) // 60
```

---

## API Reference

### Stream creation

| Function                   | Description                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| `createReadable(iterable)` | Create a stream from arrays, generators, sets, strings — any iterable |
| `createWritable(fn)`       | Create a writable stream from a callback function                     |
| `range(min, max, step?)`   | Generate a stream of numbers in a range                               |
| `words(chars, length)`     | Generate a stream of random strings                                   |

### Transformations (non-consuming)

These return a **new stream** — the original is not consumed.

| Function                                 | Description                                                  |
| ---------------------------------------- | ------------------------------------------------------------ |
| `map(stream, ...fns)`                    | Transform each chunk (supports chaining multiple transforms) |
| `filter(stream, fn)`                     | Keep only chunks matching a predicate                        |
| `flat(stream, depth?)`                   | Flatten a stream of arrays                                   |
| `flatMap(stream, fn)`                    | Map + flatten in one step                                    |
| `slice(stream, start, end?)`             | Extract a portion of the stream                              |
| `splice(stream, start, count, ...items)` | Remove/insert chunks at a position                           |
| `concat(...streams)`                     | Concatenate multiple streams sequentially                    |
| `zip(...streams)`                        | Combine streams into a stream of tuples                      |
| `pipe(stream, ...fns)`                   | Chain multiple stream operations                             |
| `branch(stream, n)`                      | Split a stream into `n` independent copies                   |

### Consumers (consuming)

These **consume the stream** — it cannot be reused afterward.

| Function                   | Description                           |
| -------------------------- | ------------------------------------- |
| `reduce(stream, fn, init)` | Reduce to a single value              |
| `list(stream)`             | Collect all chunks into an array      |
| `some(stream, fn)`         | Check if any chunk matches            |
| `every(stream, fn)`        | Check if all chunks match             |
| `forEach(stream, fn)`      | Execute a function for each chunk     |
| `includes(stream, value)`  | Check if a value exists in the stream |
| `at(stream, index)`        | Get the chunk at a specific index     |
| `indexOf(stream, value)`   | Find the index of a value             |

### Consuming vs non-consuming

> **Rule of thumb:** If it returns a `ReadableStream`, it's non-consuming. If it returns a `Promise`, it consumes the stream.

Need to consume a stream multiple times? Use `branch()` first:

```typescript
const [forSum, forCount] = branch(numbers, 2)

const sum = await reduce(forSum, (a, b) => a + b, 0)
const count = await reduce(forCount, (acc) => acc + 1, 0)
```

---

## Streams the Hard Way vs streamfu

Every example below shows a real task done **the hard way** with native Web Streams, then **the easy way** with streamfu.

<details>
<summary><strong>1. Transform every chunk</strong> — Parse CSV lines and uppercase names</summary>

**Before — native Web Streams:**

```typescript
const transform1 = new TransformStream({
  transform(line, ctrl) {
    ctrl.enqueue(line.split(","))
  },
})
const transform2 = new TransformStream({
  transform(cols, ctrl) {
    ctrl.enqueue({ name: cols[0].toUpperCase(), age: Number(cols[1]) })
  },
})

const reader = csvStream.pipeThrough(transform1).pipeThrough(transform2).getReader()
const results = []
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  results.push(value)
}
reader.releaseLock()
```

**After — streamfu:**

```typescript
import { createReadable, list, map } from "@sgmonda/streamfu"

const stream = map(
  csvStream,
  (line) => line.split(","),
  (cols) => ({ name: cols[0].toUpperCase(), age: Number(cols[1]) }),
)
const results = await list(stream)
```

</details>

<details>
<summary><strong>2. Filter and collect</strong> — Keep only active users from a stream</summary>

**Before — native Web Streams:**

```typescript
const filter = new TransformStream({
  transform(user, ctrl) {
    if (user.status === "active") ctrl.enqueue(user)
  },
})

const reader = usersStream.pipeThrough(filter).getReader()
const active = []
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  active.push(value)
}
reader.releaseLock()
```

**After — streamfu:**

```typescript
import { filter, list } from "@sgmonda/streamfu"

const active = await list(filter(usersStream, (u) => u.status === "active"))
```

</details>

<details>
<summary><strong>3. Reduce to a single value</strong> — Sum a stream of numbers</summary>

**Before — native Web Streams:**

```typescript
const reader = numbersStream.getReader()
let total = 0
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  total += value
}
reader.releaseLock()
```

**After — streamfu:**

```typescript
import { reduce } from "@sgmonda/streamfu"

const total = await reduce(numbersStream, (sum, n) => sum + n, 0)
```

</details>

<details>
<summary><strong>4. Multi-step pipeline</strong> — Filter, transform, and collect in one chain</summary>

**Before — native Web Streams:**

```typescript
const filterStep = new TransformStream({
  transform(n, ctrl) {
    if (n % 2 === 0) ctrl.enqueue(n)
  },
})
const doubleStep = new TransformStream({
  transform(n, ctrl) {
    ctrl.enqueue(n * 2)
  },
})
const toStringStep = new TransformStream({
  transform(n, ctrl) {
    ctrl.enqueue(`Value: ${n}`)
  },
})

const reader = numbersStream
  .pipeThrough(filterStep)
  .pipeThrough(doubleStep)
  .pipeThrough(toStringStep)
  .getReader()
const results = []
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  results.push(value)
}
reader.releaseLock()
```

**After — streamfu:**

```typescript
import { filter, list, map, pipe } from "@sgmonda/streamfu"

const results = await list(pipe(
  numbersStream,
  (r) => filter(r, (n) => n % 2 === 0),
  (r) => map(r, (n) => n * 2),
  (r) => map(r, (n) => `Value: ${n}`),
))
```

</details>

<details>
<summary><strong>5. Concatenate multiple sources</strong> — Merge API pages into one stream and take the first 50</summary>

**Before — native Web Streams:**

```typescript
const sources = [page1Stream, page2Stream, page3Stream]
const reader1 = sources[0].getReader()
const reader2 = sources[1].getReader()
const reader3 = sources[2].getReader()
const all = []

for (const reader of [reader1, reader2, reader3]) {
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    all.push(value)
  }
  reader.releaseLock()
}
const first50 = all.slice(0, 50)
```

**After — streamfu:**

```typescript
import { concat, list, slice } from "@sgmonda/streamfu"

const first50 = await list(slice(concat(page1Stream, page2Stream, page3Stream), 0, 50))
```

</details>

<details>
<summary><strong>6. Zip parallel streams</strong> — Pair names with scores into labeled strings</summary>

**Before — native Web Streams:**

```typescript
const readerA = namesStream.getReader()
const readerB = scoresStream.getReader()
const leaderboard = []

while (true) {
  const [a, b] = await Promise.all([readerA.read(), readerB.read()])
  if (a.done || b.done) break
  leaderboard.push(`${a.value}: ${b.value}`)
}
readerA.releaseLock()
readerB.releaseLock()
```

**After — streamfu:**

```typescript
import { list, map, zip } from "@sgmonda/streamfu"

const leaderboard = await list(map(zip(namesStream, scoresStream), ([name, score]) => `${name}: ${score}`))
```

</details>

<details>
<summary><strong>7. Consume a stream twice</strong> — Get both the sum and the max from the same stream</summary>

**Before — native Web Streams:**

```typescript
const [copy1, copy2] = numbersStream.tee()

const reader1 = copy1.getReader()
let sum = 0
while (true) {
  const { done, value } = await reader1.read()
  if (done) break
  sum += value
}
reader1.releaseLock()

const reader2 = copy2.getReader()
let max = -Infinity
while (true) {
  const { done, value } = await reader2.read()
  if (done) break
  if (value > max) max = value
}
reader2.releaseLock()
```

**After — streamfu:**

```typescript
import { branch, reduce } from "@sgmonda/streamfu"

const [forSum, forMax] = branch(numbersStream, 2)

const [sum, max] = await Promise.all([
  reduce(forSum, (a, b) => a + b, 0),
  reduce(forMax, (a, b) => (b > a ? b : a), -Infinity),
])
```

</details>

<details>
<summary><strong>8. Flatten paginated results</strong> — Expand arrays of items into individual chunks</summary>

**Before — native Web Streams:**

```typescript
// Each chunk is an array like [item1, item2, item3] from a paginated API
const flatten = new TransformStream({
  transform(page, ctrl) {
    for (const item of page) ctrl.enqueue(item)
  },
})
const label = new TransformStream({
  transform(item, ctrl) {
    ctrl.enqueue(`#${item.id}: ${item.title}`)
  },
})

const reader = pagesStream.pipeThrough(flatten).pipeThrough(label).getReader()
const items = []
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  items.push(value)
}
reader.releaseLock()
```

**After — streamfu:**

```typescript
import { flatMap, list, map } from "@sgmonda/streamfu"

const items = await list(map(flatMap(pagesStream, (page) => page), (item) => `#${item.id}: ${item.title}`))
```

</details>

<details>
<summary><strong>9. Quick queries on a stream</strong> — Answer five questions about the data without five manual loops</summary>

**Before — native Web Streams:**

```typescript
// Need 5 copies — tee() only gives 2, so we chain:
const [s1, rest1] = dataStream.tee()
const [s2, rest2] = rest1.tee()
const [s3, rest3] = rest2.tee()
const [s4, s5] = rest3.tee()

// Does it contain 42?
let hasFortyTwo = false
const r1 = s1.getReader()
while (true) {
  const { done, value } = await r1.read()
  if (done) break
  if (value === 42) {
    hasFortyTwo = true
    break
  }
}
r1.releaseLock()

// Are all values positive?
let allPositive = true
const r2 = s2.getReader()
while (true) {
  const { done, value } = await r2.read()
  if (done) break
  if (value <= 0) {
    allPositive = false
    break
  }
}
r2.releaseLock()

// Is any value greater than 100?
let anyOver100 = false
const r3 = s3.getReader()
while (true) {
  const { done, value } = await r3.read()
  if (done) break
  if (value > 100) {
    anyOver100 = true
    break
  }
}
r3.releaseLock()

// Where is 7?
let indexOf7 = -1
let idx = 0
const r4 = s4.getReader()
while (true) {
  const { done, value } = await r4.read()
  if (done) break
  if (value === 7) {
    indexOf7 = idx
    break
  }
  idx++
}
r4.releaseLock()

// What's the third element?
let third = undefined
let count = 0
const r5 = s5.getReader()
while (true) {
  const { done, value } = await r5.read()
  if (done) break
  if (count === 2) {
    third = value
    break
  }
  count++
}
r5.releaseLock()
```

**After — streamfu:**

```typescript
import { at, branch, every, includes, indexOf, some } from "@sgmonda/streamfu"

const [s1, s2, s3, s4, s5] = branch(dataStream, 5)

const [hasFortyTwo, allPositive, anyOver100, indexOf7, third] = await Promise.all([
  includes(s1, 42),
  every(s2, (n) => n > 0),
  some(s3, (n) => n > 100),
  indexOf(s4, 7),
  at(s5, 2),
])
```

</details>

<details>
<summary><strong>10. Generate, splice, and process</strong> — Create a range, replace elements, and log results</summary>

**Before — native Web Streams:**

```typescript
// Generate 1..10 manually
const numbers = new ReadableStream({
  start(ctrl) {
    for (let i = 1; i <= 10; i++) ctrl.enqueue(i)
    ctrl.close()
  },
})

// Splice: remove 3 items at index 3, insert 99 and 100
let idx = 0
const removed = 3
const spliceTransform = new TransformStream({
  transform(chunk, ctrl) {
    if (idx === 3 + removed) {
      ctrl.enqueue(99)
      ctrl.enqueue(100)
    }
    if (idx < 3 || idx >= 3 + removed) {
      ctrl.enqueue(chunk)
    }
    idx++
  },
  flush(ctrl) {
    if (idx <= 3 + removed) {
      ctrl.enqueue(99)
      ctrl.enqueue(100)
    }
  },
})

// Double each value
const doubleTransform = new TransformStream({
  transform(n, ctrl) {
    ctrl.enqueue(n * 2)
  },
})

const reader = numbers.pipeThrough(spliceTransform).pipeThrough(doubleTransform).getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  console.log(value)
}
reader.releaseLock()
```

**After — streamfu:**

```typescript
import { forEach, map, pipe, range, splice } from "@sgmonda/streamfu"

await forEach(
  pipe(
    range(1, 10),
    (r) => splice(r, 3, 3, 99, 100),
    (r) => map(r, (n) => n * 2),
  ),
  (value) => console.log(value),
)
```

</details>

---

## Design principles

- **Functional & pure** — No side effects, no mutations. Every operation returns a new stream.
- **Familiar API** — Mirrors `Array.prototype` methods. Zero learning curve.
- **Universal** — Built on the [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Works in Node.js, Deno, Bun, and browsers.
- **Type-safe** — Full TypeScript support with precise generics.
- **Tested** — 100% code coverage. Every function, every edge case.

---

### Error handling

One of the trickiest parts of working with streams is error handling. The traditional approach relies on listening to events, which splits your logic across multiple callbacks and makes the control flow hard to follow:

```typescript
// ❌ Event-based error handling: scattered logic, easy to forget a listener
stream.on("data", (chunk) => {/* process chunk */})
stream.on("error", (err) => {/* handle error */})
stream.on("end", () => {/* cleanup */})
```

This pattern has several problems:

- Error handling is **disconnected** from the processing logic
- Forgetting the `error` listener can cause **unhandled exceptions** that crash your process
- Coordinating `end` and `error` to know when the stream is truly done requires **extra state**
- It doesn't compose well with `async/await` code

In streamfu, errors propagate automatically through chained operations. If a `map()` transformer or a `filter()` predicate throws, the error bubbles up and rejects the promise returned by any consuming operation (`list()`, `reduce()`, `every()`, etc.). This means you can use a standard `try/catch` block:

```typescript
// ✅ Errors propagate through the entire chain
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

No special error listeners, no extra plumbing. Errors flow naturally through `map()`, `filter()`, and any other chained transformation, all the way to whichever consumer ends the pipeline.

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
