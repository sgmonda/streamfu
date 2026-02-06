---
layout: default
title: Consumer Functions
---

# Consumer Functions

These **consume the stream** and return a `Promise` — it cannot be reused afterward.

Need to consume a stream more than once? Use [`branch()`]({{ '/api/transformations' | relative_url }}#branch) first.

---

## reduce

Reduces a stream to a single value, like `Array.prototype.reduce`.

```typescript
function reduce<T, U>(readable: ReadableStream<T>, fn: (acc: U, chunk: T) => U, initialValue: U): Promise<U>
```

| Parameter      | Type                      | Description               |
| -------------- | ------------------------- | ------------------------- |
| `readable`     | `ReadableStream<T>`       | The stream to reduce      |
| `fn`           | `(acc: U, chunk: T) => U` | Reducer function          |
| `initialValue` | `U`                       | Initial accumulator value |

**Returns:** `Promise<U>`

```typescript
import { createReadable, reduce } from "@sgmonda/streamfu"

const sum = await reduce(createReadable([1, 2, 3, 4, 5]), (acc, n) => acc + n, 0)
// 15
```

---

## list

Collects all chunks into an array.

```typescript
function list<T>(readable: ReadableStream<T>): Promise<T[]>
```

| Parameter  | Type                | Description           |
| ---------- | ------------------- | --------------------- |
| `readable` | `ReadableStream<T>` | The stream to collect |

**Returns:** `Promise<T[]>`

```typescript
import { createReadable, list } from "@sgmonda/streamfu"

const items = await list(createReadable([1, 2, 3]))
// [1, 2, 3]
```

---

## at

Gets the chunk at a specific index.

```typescript
function at<T>(readable: ReadableStream<T>, index: number): Promise<T | undefined>
```

| Parameter  | Type                | Description           |
| ---------- | ------------------- | --------------------- |
| `readable` | `ReadableStream<T>` | The stream to query   |
| `index`    | `number`            | The index to retrieve |

**Returns:** `Promise<T | undefined>` — `undefined` if index is out of bounds

```typescript
import { at, createReadable } from "@sgmonda/streamfu"

const third = await at(createReadable([10, 20, 30, 40, 50]), 2)
// 30
```

---

## some

Checks if any chunk matches a predicate. Short-circuits on first match.

```typescript
function some<T>(readable: ReadableStream<T>, predicate: (chunk: T) => boolean): Promise<boolean>
```

| Parameter   | Type                    | Description         |
| ----------- | ----------------------- | ------------------- |
| `readable`  | `ReadableStream<T>`     | The stream to check |
| `predicate` | `(chunk: T) => boolean` | Test function       |

**Returns:** `Promise<boolean>`

```typescript
import { createReadable, some } from "@sgmonda/streamfu"

const hasEven = await some(createReadable([1, 3, 4, 7]), (n) => n % 2 === 0)
// true
```

---

## every

Checks if all chunks match a predicate. Short-circuits on first failure.

```typescript
function every<T>(readable: ReadableStream<T>, predicate: (chunk: T) => boolean): Promise<boolean>
```

| Parameter   | Type                    | Description         |
| ----------- | ----------------------- | ------------------- |
| `readable`  | `ReadableStream<T>`     | The stream to check |
| `predicate` | `(chunk: T) => boolean` | Test function       |

**Returns:** `Promise<boolean>`

```typescript
import { createReadable, every } from "@sgmonda/streamfu"

const allPositive = await every(createReadable([1, 2, 3]), (n) => n > 0)
// true
```

---

## forEach

Executes a function for each chunk. Receives the chunk and its index.

```typescript
function forEach<T>(readable: ReadableStream<T>, fn: (chunk: T, index: number) => void | Promise<void>): Promise<void>
```

| Parameter  | Type                                | Description           |
| ---------- | ----------------------------------- | --------------------- |
| `readable` | `ReadableStream<T>`                 | The stream to iterate |
| `fn`       | `(chunk: T, index: number) => void` | Function to execute   |

**Returns:** `Promise<void>`

```typescript
import { createReadable, forEach } from "@sgmonda/streamfu"

await forEach(createReadable([1, 2, 3]), (value, i) => {
  console.log(`${i}: ${value}`)
})
// 0: 1
// 1: 2
// 2: 3
```

---

## includes

Checks if a value exists in the stream. Short-circuits on first match.

```typescript
function includes<T>(readable: ReadableStream<T>, value: T): Promise<boolean>
```

| Parameter  | Type                | Description          |
| ---------- | ------------------- | -------------------- |
| `readable` | `ReadableStream<T>` | The stream to search |
| `value`    | `T`                 | Value to find        |

**Returns:** `Promise<boolean>`

```typescript
import { createReadable, includes } from "@sgmonda/streamfu"

const has42 = await includes(createReadable([1, 2, 42, 100]), 42)
// true
```

---

## indexOf

Finds the index of the first occurrence of a value. Returns `-1` if not found.

```typescript
function indexOf<T>(readable: ReadableStream<T>, value: T): Promise<number>
```

| Parameter  | Type                | Description          |
| ---------- | ------------------- | -------------------- |
| `readable` | `ReadableStream<T>` | The stream to search |
| `value`    | `T`                 | Value to find        |

**Returns:** `Promise<number>`

```typescript
import { createReadable, indexOf } from "@sgmonda/streamfu"

const idx = await indexOf(createReadable(["a", "b", "c", "d"]), "c")
// 2
```
