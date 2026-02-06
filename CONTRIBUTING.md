# Contributing to Streamfu

Thanks for your interest in contributing to Streamfu! This guide will help you get started.

## Prerequisites

- [Deno](https://deno.land/) (primary runtime)
- [Node.js](https://nodejs.org/) (for example tests)
- [Bun](https://bun.sh/) (for example tests)

## Getting Started

1. Fork and clone the repository
2. Run the test suite to make sure everything works:

```bash
deno task test
```

## Development Workflow

### Commands

```bash
deno task check          # Type-check all TypeScript files
deno task lint           # Format + lint
deno task test           # Full suite: type-check, lint, unit tests with coverage, example tests
```

To run a single test file:

```bash
deno test --allow-all src/map.test.ts
```

### Code Style

Code style is enforced automatically by `deno fmt`. The rules are:

- No semicolons
- Double quotes
- 2-space indentation (no tabs)
- 120-character line width

Run `deno task lint` to format and lint your code before committing.

### Testing

- Tests are colocated with source files: `src/foo.ts` has its tests in `src/foo.test.ts`
- The project maintains **100% code coverage**
- Tests use Deno's native test runner with `@std/assert`
- Follow the existing data-driven pattern:

```typescript
const TEST_CASES = [
  { title: "description of case", conditions: { /* input */ }, expected: { /* output */ } },
]

Deno.test("functionName()", async ({ step }) => {
  for (const tc of TEST_CASES) {
    await step(tc.title, async () => {
      // assertions
    })
  }
})
```

## Project Structure

- `mod.ts` — Entry point, re-exports all public functions
- `src/` — Source code and colocated tests
- `src/system/` — Platform abstraction (runtime detection, stream normalization)
- `src/generators/` — Stream generators (`range`, `words`)
- `examples/` — Multi-runtime usage examples (Deno, Node, Bun, Cloudflare Workers)

## Submitting Changes

1. Create a branch from `main`
2. Make your changes
3. Ensure all tests pass with `deno task test`
4. Ensure code coverage remains at 100%
5. Open a pull request against `main`

CI will run tests automatically on your PR.

## Guidelines

- All operations must be **pure functions** with no mutations
- Transform operations should wrap callbacks in try/catch and propagate errors via `controller.error(e)`
- Support **async callbacks** in all operations
- Keep multi-runtime compatibility in mind (Deno, Node.js, Bun, browsers, Cloudflare Workers)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
