![header](https://github.com/user-attachments/assets/97963ef5-68a6-449e-ad16-081a9bdc9103)

# Streamfu [![JSR Score](https://jsr.io/badges/@sgmonda/streamfu/score)](https://jsr.io/@sgmonda/streamfu)

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

#### Operations comparison table

| Operation    | Consumes | Returns                   | Description                         |
| ------------ | :------: | ------------------------- | ----------------------------------- |
| `branch()`   |   no*    | `ReadableStream<T>[]`     | Clone stream into multiple branches |
| `concat()`   |    no    | `ReadableStream<T>`       | Concatenate multiple streams        |
| `filter()`   |    no    | `ReadableStream<T>`       | Filter chunks by predicate          |
| `flat()`     |    no    | `ReadableStream<T>`       | Flatten nested arrays               |
| `flatMap()`  |    no    | `ReadableStream<U>`       | Map + flatten in one step           |
| `map()`      |    no    | `ReadableStream<Tout>`    | Transform each chunk                |
| `slice()`    |    no    | `ReadableStream<T>`       | Extract portion of stream           |
| `splice()`   |    no    | `ReadableStream<T>`       | Replace items at index              |
| `zip()`      |    no    | `ReadableStream<[...]>`   | Combine streams into tuples         |
| `at()`       |   yes    | `Promise<T \| undefined>` | Get value at index                  |
| `every()`    |   yes    | `Promise<boolean>`        | Test if all chunks pass predicate   |
| `forEach()`  |   yes    | `Promise<void>`           | Execute function for each chunk     |
| `includes()` |   yes    | `Promise<boolean>`        | Check if value exists               |
| `indexOf()`  |   yes    | `Promise<number>`         | Find index of value                 |
| `list()`     |   yes    | `Promise<T[]>`            | Collect all chunks into array       |
| `reduce()`   |   yes    | `Promise<Taccum>`         | Reduce to single value              |
| `some()`     |   yes    | `Promise<boolean>`        | Test if any chunk passes predicate  |

_\* `branch()` locks the original stream but doesn't consume it._

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

### Error handling with `forEach()`

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

With `forEach()`, the stream is consumed and any error (either from the stream itself or from your callback) rejects the returned promise. This means you can use a standard `try/catch` block:

```typescript
// ✅ Promise-based error handling: linear, composable, hard to miss
try {
  await forEach(stream, () => {})
  console.log("Done")
} catch (err) {
  console.error("Something failed:", err)
}
```

This works equally well with other consuming operations like `reduce()`, `list()` or `every()`, since they all return promises. `forEach()` is especially handy when you only care about side effects (logging, writing to a file, sending data) and don't need a return value.

## Contributing

This package is open to contributions. If you want to contribute, just fork the repository, make your changes, and submit a PR. Remember to include tests and run the following:

```
deno task test
```

Some key points to consider:

- Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
- The code should be well tested. Only a 100% coverage will pass our checks.
- The code should be well documented. Every exported function should have a complete JSDoc comment.

### Publishing

This package is published to JSR by mean of GitHub CI, so a new version is published automatically when:

- A new commit is pushed to the `main` branch
- `version` changes in `deno.json`
