# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.7.2] - 2026-05-19

### Fixed

- **map()**: chained transformers now receive the same chunk index for the same chunk. Previously the index was incremented per transformer invocation, so `map(s, fn1, fn2, fn3)` over 5 chunks made `fn1` see indices `[0, 3, 6, 9, 12]` instead of `[0, 1, 2, 3, 4]`.
- **splice()**: insert-only calls (`replaced === 0`) and calls with `start` beyond the stream length now correctly insert the new items, matching `Array.prototype.splice`. Previously the items were silently dropped.
- **concat()**: respects consumer backpressure. Earlier the first `pull()` drained every source stream eagerly, so combining `concat` with `slice()`, `take()`, or any early-terminating operator wastefully read sources the consumer never asked for. Later sources are now opened only when the previous one is drained, and not at all if the consumer stops first.

## [0.7.1] - 2026-05-12

### Changed

- npm package now ships a **dual CJS + ESM** build with classic `main`/`types` fields. Resolves consumption in Node.js projects using `"module": "commonjs"` and `"moduleResolution": "node10"` without requiring any `tsconfig.json` changes.
- npm publishing migrated to **Trusted Publishing (OIDC)** with provenance attestations. No long-lived `NPM_TOKEN` required.

## [0.7.0] - 2026-04-01

### Added

- `join()` consumer function — joins all stream elements into a string with a configurable separator, like `Array.prototype.join`

## [0.6.0] - 2026-04-01

### Fixed

- **range()**: Infinite loop when `step` is 0 now throws `RangeError`
- **list()**: O(n^2) performance caused by spread operator, now uses `push()` for O(n)
- **map(), filter()**: Silent error swallowing via `.catch(() => {})` replaced with `pipeThrough()`

### Changed

- `filter.ts`, `flat.ts`, `slice.ts`, `splice.ts` now import `TransformStream` explicitly from `system/stream.ts` for cross-runtime consistency
- Standardized piping pattern across all transform operations to use `pipeThrough()`

### Added

- Error propagation tests for `concat`, `zip`, `branch`, `pipe`, `every`, `some`
- Input validation test for `range(step=0)`

## [0.5.6] - 2025-12-06

### Added

- Better `branch()` tests

## [0.5.5] - 2025-12-06

### Added

- CONTRIBUTING.md and CODE_OF_CONDUCT.md
- Documentation website with new design and logo animation
- CI pipeline for building and publishing to npm

### Fixed

- Homepage link in package metadata

## [0.5.4] - 2025-12-06

### Added

- Documentation website via GitHub Pages

## [0.5.3] - 2025-12-05

### Added

- `forEach()` function
- Better type inference for `map()` and `pipe()` (up to 9 chained transforms)
- Cloudflare Workers runtime support
- Bun runtime support
- `branch()` function for splitting streams
- Error handling improvements with `controller.error()` propagation
- JSDoc documentation for all public functions
- Auto-release via CI on version bump
