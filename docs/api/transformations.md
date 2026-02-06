---
layout: default
title: Transformation Functions
---

# Transformation Functions

These return a **new `ReadableStream`** — the original is not consumed.

---

## map

Applies one or more transform functions to each chunk. Supports chaining up to 9 transforms with full type inference.

```typescript
function map<A, B>(readable: ReadableStream<A>, fn: (chunk: A) => B | Promise<B>): ReadableStream<B>
function map<A, B, C>(readable: ReadableStream<A>, fn1: (chunk: A) => B, fn2: (chunk: B) => C): ReadableStream<C>
// ... up to 9 chained transforms
```

| Parameter  | Type                  | Description                     |
| ---------- | --------------------- | ------------------------------- |
| `readable` | `ReadableStream<A>`   | The input stream                |
| `...fns`   | `((chunk: T) => U)[]` | One or more transform functions |

**Returns:** `ReadableStream` of the final transform's output type

```typescript
import { createReadable, list, map } from "@sgmonda/streamfu"

const stream = createReadable(["alice", "bob", "charlie"])

// Single transform
const upper = map(stream, (s) => s.toUpperCase())
// ["ALICE", "BOB", "CHARLIE"]

// Chained transforms — types flow through
const result = map(
  createReadable(["1,alice", "2,bob"]),
  (line) => line.split(","),
  (cols) => ({ id: Number(cols[0]), name: cols[1] }),
)
// [{ id: 1, name: "alice" }, { id: 2, name: "bob" }]
```

---

## filter

Keeps only chunks that match a predicate function. Supports async predicates.

```typescript
function filter<T>(readable: ReadableStream<T>, fn: (chunk: T) => boolean | Promise<boolean>): ReadableStream<T>
```

| Parameter  | Type                                        | Description        |
| ---------- | ------------------------------------------- | ------------------ |
| `readable` | `ReadableStream<T>`                         | The input stream   |
| `fn`       | `(chunk: T) => boolean \| Promise<boolean>` | Predicate function |

**Returns:** `ReadableStream<T>`

```typescript
import { createReadable, filter, list } from "@sgmonda/streamfu"

const evens = await list(
  filter(createReadable([1, 2, 3, 4, 5]), (n) => n % 2 === 0),
)
// [2, 4]
```

---

## flat

Flattens a stream of arrays.

```typescript
function flat<T>(readable: ReadableStream<unknown>, depth?: number): ReadableStream<T>
```

| Parameter  | Type             | Default | Description           |
| ---------- | ---------------- | ------- | --------------------- |
| `readable` | `ReadableStream` | —       | The stream to flatten |
| `depth`    | `number`         | `1`     | How deep to flatten   |

**Returns:** `ReadableStream<T>`

```typescript
import { createReadable, flat, list } from "@sgmonda/streamfu"

const result = await list(
  flat(createReadable([[1, 2], [3, 4], [5]])),
)
// [1, 2, 3, 4, 5]
```

---

## flatMap

Map + flatten in one step. Applies a function that returns an array, then flattens by one level.

```typescript
function flatMap<T, U>(readable: ReadableStream<T>, mapper: (chunk: T) => U[]): ReadableStream<U>
```

| Parameter  | Type                | Description                 |
| ---------- | ------------------- | --------------------------- |
| `readable` | `ReadableStream<T>` | The input stream            |
| `mapper`   | `(chunk: T) => U[]` | Function returning an array |

**Returns:** `ReadableStream<U>`

```typescript
import { createReadable, flatMap, list } from "@sgmonda/streamfu"

const result = await list(
  flatMap(createReadable([1, 2, 3]), (n) => [n, n * 10]),
)
// [1, 10, 2, 20, 3, 30]
```

---

## slice

Extracts a portion of the stream between start and end indexes.

```typescript
function slice<T>(readable: ReadableStream<T>, start: number, end?: number): ReadableStream<T>
```

| Parameter  | Type                | Default    | Description             |
| ---------- | ------------------- | ---------- | ----------------------- |
| `readable` | `ReadableStream<T>` | —          | The stream to slice     |
| `start`    | `number`            | —          | Start index (inclusive) |
| `end`      | `number`            | `Infinity` | End index (exclusive)   |

**Returns:** `ReadableStream<T>`

```typescript
import { createReadable, list, slice } from "@sgmonda/streamfu"

const result = await list(
  slice(createReadable([10, 20, 30, 40, 50]), 1, 4),
)
// [20, 30, 40]
```

---

## splice

Remove and/or insert chunks at a position.

```typescript
function splice<T>(readable: ReadableStream<T>, start: number, replaced: number, ...newItems: T[]): ReadableStream<T>
```

| Parameter     | Type                | Description                       |
| ------------- | ------------------- | --------------------------------- |
| `readable`    | `ReadableStream<T>` | The input stream                  |
| `start`       | `number`            | Index at which to start replacing |
| `replaced`    | `number`            | Number of items to remove         |
| `...newItems` | `T[]`               | Items to insert                   |

**Returns:** `ReadableStream<T>`

```typescript
import { createReadable, list, splice } from "@sgmonda/streamfu"

const result = await list(
  splice(createReadable([1, 2, 3, 4, 5]), 2, 1, 99, 100),
)
// [1, 2, 99, 100, 4, 5]
```

---

## concat

Concatenates multiple streams sequentially.

```typescript
function concat<T>(...readables: ReadableStream<T>[]): ReadableStream<T>
```

| Parameter      | Type                  | Description            |
| -------------- | --------------------- | ---------------------- |
| `...readables` | `ReadableStream<T>[]` | Streams to concatenate |

**Returns:** `ReadableStream<T>`

```typescript
import { concat, createReadable, list } from "@sgmonda/streamfu"

const result = await list(
  concat(createReadable([1, 2]), createReadable([3, 4]), createReadable([5])),
)
// [1, 2, 3, 4, 5]
```

---

## zip

Combines multiple streams into a stream of tuples. The shortest stream determines the output length.

```typescript
function zip<T extends readonly ReadableStream<unknown>[]>(...readables: T): ReadableStream<ITuple<T>>
```

| Parameter      | Type               | Description        |
| -------------- | ------------------ | ------------------ |
| `...readables` | `ReadableStream[]` | Streams to combine |

**Returns:** `ReadableStream<[T1, T2, ...]>` — tuples of values from each stream

```typescript
import { createReadable, list, zip } from "@sgmonda/streamfu"

const result = await list(
  zip(createReadable(["a", "b", "c"]), createReadable([1, 2, 3])),
)
// [["a", 1], ["b", 2], ["c", 3]]
```

---

## pipe

Chains multiple stream operations with full type inference (up to 9 transforms).

```typescript
function pipe<A, B>(readable: ReadableStream<A>, fn1: (r: ReadableStream<A>) => ReadableStream<B>): ReadableStream<B>
function pipe<A, B, C>(readable: ReadableStream<A>, fn1: ..., fn2: ...): ReadableStream<C>
// ... up to 9 chained functions
```

| Parameter  | Type                                        | Description         |
| ---------- | ------------------------------------------- | ------------------- |
| `readable` | `ReadableStream<A>`                         | The input stream    |
| `...fns`   | `((r: ReadableStream) => ReadableStream)[]` | Transform functions |

**Returns:** `ReadableStream` of the final function's output type

```typescript
import { createReadable, filter, list, map, pipe } from "@sgmonda/streamfu"

const result = await list(pipe(
  createReadable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  (r) => filter(r, (n) => n % 2 === 0),
  (r) => map(r, (n) => n * 2),
  (r) => map(r, (n) => `Value: ${n}`),
))
// ["Value: 4", "Value: 8", "Value: 12", "Value: 16", "Value: 20"]
```

---

## branch

Splits a stream into `n` independent copies. The original stream is locked after branching.

```typescript
function branch<T>(readable: ReadableStream<T>, n: number): ReadableStream<T>[]
```

| Parameter  | Type                | Description      |
| ---------- | ------------------- | ---------------- |
| `readable` | `ReadableStream<T>` | Stream to branch |
| `n`        | `number`            | Number of copies |

**Returns:** `ReadableStream<T>[]`

```typescript
import { branch, createReadable, list, reduce } from "@sgmonda/streamfu"

const [forSum, forList] = branch(createReadable([1, 2, 3]), 2)

const sum = await reduce(forSum, (a, b) => a + b, 0) // 6
const items = await list(forList) // [1, 2, 3]
```
