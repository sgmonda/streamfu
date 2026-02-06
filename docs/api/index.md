---
layout: default
title: API Reference
---

# API Reference

streamfu provides **22 functions** organized in three categories.

> **Rule of thumb:** If it returns a `ReadableStream`, it's non-consuming. If it returns a `Promise`, it consumes the stream.

---

## Creation

Functions that create new streams from various data sources.

| Function                                        | Description                     |
| ----------------------------------------------- | ------------------------------- |
| [`createReadable(iterable)`]({{ '/api/creation' | relative_url }}#createreadable) |
| [`createWritable(fn)`]({{ '/api/creation'       | relative_url }}#createwritable) |
| [`range(min, max, step?)`]({{ '/api/creation'   | relative_url }}#range)          |
| [`words(chars, length)`]({{ '/api/creation'     | relative_url }}#words)          |

## Transformations (non-consuming)

These return a **new `ReadableStream`** — the original is not consumed.

| Function                                                             | Description              |
| -------------------------------------------------------------------- | ------------------------ |
| [`map(stream, ...fns)`]({{ '/api/transformations'                    | relative_url }}#map)     |
| [`filter(stream, fn)`]({{ '/api/transformations'                     | relative_url }}#filter)  |
| [`flat(stream, depth?)`]({{ '/api/transformations'                   | relative_url }}#flat)    |
| [`flatMap(stream, fn)`]({{ '/api/transformations'                    | relative_url }}#flatmap) |
| [`slice(stream, start, end?)`]({{ '/api/transformations'             | relative_url }}#slice)   |
| [`splice(stream, start, count, ...items)`]({{ '/api/transformations' | relative_url }}#splice)  |
| [`concat(...streams)`]({{ '/api/transformations'                     | relative_url }}#concat)  |
| [`zip(...streams)`]({{ '/api/transformations'                        | relative_url }}#zip)     |
| [`pipe(stream, ...fns)`]({{ '/api/transformations'                   | relative_url }}#pipe)    |
| [`branch(stream, n)`]({{ '/api/transformations'                      | relative_url }}#branch)  |

## Consumers (consuming)

These **consume the stream** and return a `Promise` — it cannot be reused afterward. Use [`branch()`]({{ '/api/transformations' | relative_url }}#branch) first if you need to consume a stream multiple times.

| Function                                         | Description               |
| ------------------------------------------------ | ------------------------- |
| [`reduce(stream, fn, init)`]({{ '/api/consumers' | relative_url }}#reduce)   |
| [`list(stream)`]({{ '/api/consumers'             | relative_url }}#list)     |
| [`at(stream, index)`]({{ '/api/consumers'        | relative_url }}#at)       |
| [`some(stream, fn)`]({{ '/api/consumers'         | relative_url }}#some)     |
| [`every(stream, fn)`]({{ '/api/consumers'        | relative_url }}#every)    |
| [`forEach(stream, fn)`]({{ '/api/consumers'      | relative_url }}#foreach)  |
| [`includes(stream, value)`]({{ '/api/consumers'  | relative_url }}#includes) |
| [`indexOf(stream, value)`]({{ '/api/consumers'   | relative_url }}#indexof)  |
