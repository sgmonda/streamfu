---
layout: default
title: Examples
---

# Examples

Every example below shows a real task done **the hard way** with native Web Streams, then **the easy way** with streamfu.

---

## 1. Transform every chunk

Parse CSV lines and uppercase names.

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
import { list, map } from "@sgmonda/streamfu"

const stream = map(
  csvStream,
  (line) => line.split(","),
  (cols) => ({ name: cols[0].toUpperCase(), age: Number(cols[1]) }),
)
const results = await list(stream)
```

---

## 2. Filter and collect

Keep only active users from a stream.

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

---

## 3. Reduce to a single value

Sum a stream of numbers.

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

---

## 4. Multi-step pipeline

Filter, transform, and collect in one chain.

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

---

## 5. Concatenate multiple sources

Merge API pages into one stream and take the first 50.

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

---

## 6. Zip parallel streams

Pair names with scores into labeled strings.

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

const leaderboard = await list(
  map(zip(namesStream, scoresStream), ([name, score]) => `${name}: ${score}`),
)
```

---

## 7. Consume a stream twice

Get both the sum and the max from the same stream.

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

---

## 8. Flatten paginated results

Expand arrays of items into individual chunks.

**Before — native Web Streams:**

```typescript
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

const items = await list(
  map(flatMap(pagesStream, (page) => page), (item) => `#${item.id}: ${item.title}`),
)
```

---

## 9. Quick queries on a stream

Answer five questions about the data without five manual loops.

**Before — native Web Streams:**

```typescript
// Need 5 copies — tee() only gives 2, so we chain:
const [s1, rest1] = dataStream.tee()
const [s2, rest2] = rest1.tee()
const [s3, rest3] = rest2.tee()
const [s4, s5] = rest3.tee()

// Each requires its own while(true) loop...
// (50+ lines of boilerplate omitted)
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

---

## 10. Generate, splice, and process

Create a range, replace elements, and log results.

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
// (20+ lines of TransformStream boilerplate)

// Double each value
// (another TransformStream...)

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
