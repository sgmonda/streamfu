---
layout: default
title: Creation Functions
---

# Creation Functions

Functions that create new streams from various data sources.

---

## createReadable

Creates a readable stream from an iterable. Every item in the iterable becomes a chunk in the stream.

```typescript
function createReadable<T>(iterable: Iterable<T> | AsyncIterable<T>): ReadableStream<T>
```

| Parameter  | Type                              | Description                                                |
| ---------- | --------------------------------- | ---------------------------------------------------------- |
| `iterable` | `Iterable<T> \| AsyncIterable<T>` | Anything iterable: arrays, generators, sets, strings, etc. |

**Returns:** `ReadableStream<T>`

```typescript
import { createReadable } from "@sgmonda/streamfu"

// From an array
const numbers = createReadable([1, 2, 3, 4, 5])

// From a Set
const unique = createReadable(new Set([1, 2, 3]))

// From a string (each character becomes a chunk)
const chars = createReadable("hello")

// From an async generator
const asyncStream = createReadable(async function* () {
  yield 1
  yield 2
  yield 3
}())
```

---

## createWritable

Creates a writable stream from a callback function. Every chunk written to the stream is passed to the function.

```typescript
function createWritable<T>(fn: (chunk: T) => void | Promise<void>): WritableStream<T>
```

| Parameter | Type                                  | Description                                 |
| --------- | ------------------------------------- | ------------------------------------------- |
| `fn`      | `(chunk: T) => void \| Promise<void>` | Called for each chunk written to the stream |

**Returns:** `WritableStream<T>`

```typescript
import { createWritable } from "@sgmonda/streamfu"

const logStream = createWritable(console.log)

// Use with pipeTo
await someReadable.pipeTo(logStream)
```

---

## range

Generates a stream of numbers in a range.

```typescript
function range(min: number, max: number, step?: number): ReadableStream<number>
```

| Parameter | Type     | Default | Description                    |
| --------- | -------- | ------- | ------------------------------ |
| `min`     | `number` | —       | The minimum number (inclusive) |
| `max`     | `number` | —       | The maximum number (inclusive) |
| `step`    | `number` | `1`     | The step between each number   |

**Returns:** `ReadableStream<number>`

```typescript
import { list, range } from "@sgmonda/streamfu"

const nums = await list(range(1, 5)) // [1, 2, 3, 4, 5]
const evens = await list(range(0, 10, 2)) // [0, 2, 4, 6, 8, 10]
```

---

## words

Generates a stream of random strings.

```typescript
function words(chars: number, length: number): ReadableStream<string>
```

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `chars`   | `number` | The number of characters in each word |
| `length`  | `number` | The number of words to generate       |

**Returns:** `ReadableStream<string>`

```typescript
import { list, words } from "@sgmonda/streamfu"

const randomWords = await list(words(5, 3)) // e.g. ["abcde", "fghij", "klmno"]
```
