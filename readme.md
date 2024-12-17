![header](https://github.com/user-attachments/assets/97963ef5-68a6-449e-ad16-081a9bdc9103)

Proudly published following high quality code standards: [![JSR Score](https://jsr.io/badges/@sgmonda/streamfu/score)](https://jsr.io/@sgmonda/streamfu)

# Streamfu

Pure utilities for working with streams in JS/TS in a functional way, making your code readable, predictable, maintainable and testable.

Developer experience is a key point in this package, making simple the complex.

## Introduction

Streams are async collections of data, conceptually similar to arrays, but very different in practice:

- They can be infinite
- They can be asynchronous
- They are not fully loaded in memory

For these reasons, streams are a powerful tool for working with async and huge data, but **they can be hard to work with**.

This package provides a set of utilities to work with streams in a functional way, making it easier to work with them like you would with arrays.

With **[functional way](https://en.wikipedia.org/wiki/Functional_programming)**, we're just talking about working with data following a [declarative](https://en.wikipedia.org/wiki/Declarative_programming) and [pure](https://en.wikipedia.org/wiki/Pure_function) approach. This will make your code more readable, predictable, maintainable, and testable.

This also ensure you can enjoy `streamfu` in a wide range of environments (like Node.js, Deno, or the browser) and using your favorite paradigm.

### Consuming vs non-consuming operations

Streams can be consumed only once. This means that, if you consume a stream, you can't consume it again. This is a fundamental difference with arrays.

[`streamfu`](https://jsr.io/@sgmonda/streamfu) provides a set of utilities that allows you to work with streams in a functional way, without consuming them. Take a look at `map()`, `flat()`, `zip()`... They all return a new stream, without consuming the original one.

But there are some operations that consume the stream, like `reduce()`, `some()` or `indexOf()`. These operations are marked as such in the documentation.

```typescript
// This is consuming the stream
const sumValue = await reduce(stream, (acc, value) => acc + value, 0)

// This is not consuming the stream
const mappedStream = map(stream, (value) => value * 2)
```

Just be sure to **understand when you're consuming a stream** and when you're not, to avoid unexpected behaviors. Here's a trick: if the operation returns a new stream, it's not consuming the input one. If it returns a promised value, then it's consuming it.

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

## Contributing

This package is open to contributions. If you want to contribute, you can fork the repository and submit a PR. Here are some key points to consider:

- The code should be well tested. Only a 100% coverage is accepted.
- The code should be well documented. Every exported function should have a JSDoc comment.

### Publishing

This package is published to JSR by mean of GitHub CI, so a new version is published automatically when:

- A new commit is pushed to the `main` branch
- `version` changes in `deno.json`

## TODO

- [x] Unify API for `map`, `reduce`, `filter`. Should they all receive a readable as first argument?
