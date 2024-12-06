![header](https://github.com/user-attachments/assets/97963ef5-68a6-449e-ad16-081a9bdc9103)

[![JSR Score](https://jsr.io/badges/@sgmonda/streamfu/score)](https://jsr.io/@sgmonda/streamfu) ![Tests](https://github.com/github/docs/actions/workflows/test.yml/badge.svg)

---

# Streamfu

Functional programming utilities for working with streams in JS/TS.

## Introduction

Streams are async collections of data, conceptually similar to arrays, but very different in practice. Streams are a powerful tool for working with async data, but they can be hard to work with. This package provides a set of utilities to work with streams in a functional way, making it easier to work with them.

If you know how to do something with arrays, you can do it with streams too!

## Usage

This package provides a simple and functional way to work with streams in JS/TS. To use it, you can install it from your favorite package manager.

<details>
  <summary>See installing commands for NPM, Deno, Bun...</summary>

- npm: `npx jsr add @sgmonda/streamfu`
- yarn: `yarn dlx jsr add @sgmonda/streamfu`
- pnpm: `pnpm dlx jsr add @sgmonda/streamfu`
- deno: `deno add jsr:@sgmonda/streamfu`
- bun: `bunx jsr add @sgmonda/streamfu`

</details>

Then, just import the whole module or some of its components from your code:

```typescript
import * as streamfu from "@sgmonda/streamfu"
import { map, reduce } from "@sgmonda/streamfu"
```

Now you're ready to use the utilities in your code!

### `createReadable()` and `createWritable()`

To be completed

### `map()`

To be completed

### `reduce()`

To be completed

### `filter()`

To be completed

## TODO

- [ ] Unify API for `map`, `reduce`, `filter`. Should they all receive a readable as first argument?
