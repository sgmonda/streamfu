---
layout: default
title: streamfu — Functional Stream Utilities
---

<div class="hero">
  <h1>streamfu</h1>
  <p class="tagline">Streams should feel like arrays. Now they do.</p>
  <div class="badges">
    <a href="https://jsr.io/@sgmonda/streamfu"><img src="https://jsr.io/badges/@sgmonda/streamfu/score" alt="JSR Score"></a>
    <a href="https://jsr.io/@sgmonda/streamfu"><img src="https://jsr.io/badges/@sgmonda/streamfu" alt="JSR Version"></a>
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License">
    <img src="https://img.shields.io/badge/coverage-100%25-brightgreen" alt="100% Coverage">
  </div>
  <p>Functional stream utilities for JavaScript & TypeScript.<br>Built on Web Streams. Works everywhere.</p>
  <div class="cta-group">
    <a href="{{ '/getting-started' | relative_url }}" class="cta cta-primary">Get Started</a>
    <a href="{{ '/api/' | relative_url }}" class="cta cta-secondary">API Reference</a>
    <a href="https://github.com/sgmonda/streamfu" class="cta cta-secondary" target="_blank">GitHub</a>
    <a href="https://jsr.io/@sgmonda/streamfu" class="cta cta-secondary" target="_blank">JSR</a>
  </div>
</div>

## Quick Example

```typescript
import { createReadable, filter, map, pipe, reduce } from "@sgmonda/streamfu"

const numbers = createReadable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

const stream = pipe(
  numbers,
  (r) => filter(r, (n) => n % 2 === 0),
  (r) => map(r, (n) => n * 2),
)

const result = await reduce(stream, (a, b) => a + b, 0) // 60
```

## Why streamfu?

Native Web Streams are powerful but painful. Manual reader management, mutable state, `while (true)` loops — even for simple tasks. streamfu gives you the same power with a clean, functional API.

**If you know `Array.prototype`, you already know streamfu.**

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

## Design Principles

<div class="principles-grid">
  <div class="principle-card">
    <h3>Functional & Pure</h3>
    <p>No side effects, no mutations. Every operation returns a new stream.</p>
  </div>
  <div class="principle-card">
    <h3>Familiar API</h3>
    <p>Mirrors Array.prototype methods. If you know arrays, you know streamfu.</p>
  </div>
  <div class="principle-card">
    <h3>Universal</h3>
    <p>Built on the Web Streams API. Works on Node.js, Deno, Bun, browsers, and Cloudflare Workers.</p>
  </div>
  <div class="principle-card">
    <h3>Type-safe</h3>
    <p>Full TypeScript support with precise generics and type inference through chains.</p>
  </div>
  <div class="principle-card">
    <h3>100% Tested</h3>
    <p>Every function, every edge case. Coverage enforced in CI.</p>
  </div>
</div>
