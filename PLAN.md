# streamfu — Plan TDD para v0.7.2 y v0.8.0

Objetivo: resolver el feedback OSS detectado tras la integración real en `TwenixPlatform/platform-back#5907` y dejar la librería en disposición de simplificar drásticamente ese PR.

## Convenciones

- **TDD estricto** en cada paso: RED → GREEN → REFACTOR.
- `deno task test` verde tras cada paso, 100 % de cobertura.
- Conventional Commits, un commit por paso.
- Una rama por fase (`fix/v0.7.2-bugs`, `feat/v0.8.0-api`, ...).

---

## Fase 1 — Bug fixes → publicar v0.7.2

### Paso 1.1 — Bug índice en `map(stream, fn1, fn2, ...)`

`src/map.ts:191-212` incrementa `i++` una vez por cada transformer, no por chunk.
Con `map(s, fn1, fn2, fn3)` sobre 5 chunks, `fn1` recibe `i = 0, 3, 6, 9, 12`.

- RED: caso en `TEST_CASES` que verifique que todos los transformers del mismo chunk reciben el mismo índice y que los índices crecen 0..N-1 por chunk.
- GREEN: sacar `i++` del bucle interno y aplicarlo una sola vez por chunk.
- REFACTOR: renombrar a `chunkIndex`.

### Paso 1.2 — `splice` insert-only y al final del stream

`src/splice.ts:23-32` no inserta si `replaced === 0` y no inserta si `start` queda más allá del fin del stream.

- RED: tres casos — insert-only, insert-al-final, splice normal (regresión).
- GREEN: reescribir con `transform` + `flush`, gestionando la inserción independientemente del borrado.
- REFACTOR: helper `enqueueNewItems(ctrl)`, JSDoc actualizado.

### Paso 1.3 — `concat` respeta backpressure

`src/concat.ts:10-23` itera todos los streams enteros en `pull()` sin esperar al consumidor.

- RED: con tres `range(0, 10_000)` concatenados y un `slice(_, 0, 5)`, verificar que las fuentes 2 y 3 no se han leído.
- GREEN: reescribir con async generator + `ReadableStream.from` (reusando el polyfill de Bun).
- REFACTOR: extraer `readableStreamFrom` a `src/system/stream.ts`.

### Paso 1.4 — Release v0.7.2

1. Bump `deno.json` → `0.7.2`.
2. `CHANGELOG.md` sección "Fixed".
3. Merge a `main` → CI publica en JSR y npm.
4. Smoke-test en `platform-back`.

---

## Fase 2 — API gaps → v0.8.0

### Paso 2.1 — `filter` recibe índice

- RED: `filter([10,20,30,40], (x, i) => i % 2 === 0)` → `[10,30]`.
- GREEN: contador interno, mismo patrón que `forEach`.

### Paso 2.2 — Consumer `count(stream)`

- RED: `count([])` → 0; `count(slice(range(0,1_000_000), 0, 5))` → 5.
- GREEN: `reduce(s, n => n+1, 0)`.

### Paso 2.3 — `tap(stream, fn)`

- RED: pasa chunks intactos, llama a `fn` con `(chunk, i)`, async respeta orden, errores propagan.
- GREEN: `TransformStream` que enqueua tras `await fn(chunk, i++)`.

### Paso 2.4 — `take` y `drop`

- RED: aliases de `slice`. `take(infiniteRange, 3)` termina.
- GREEN: delegación trivial.

### Paso 2.5 — `batch(stream, size)`

- RED: agrupa de N en N, último batch parcial, `size <= 0` lanza `RangeError`.
- GREEN: `TransformStream` con buffer + `flush`.

### Paso 2.6 — `merge(...streams)` interleaved

- RED: stream A delay 10ms, stream B delay 0; primeros chunks vienen de B.
- GREEN: `Promise.race` sobre readers.

### Paso 2.7 — `pipe` acepta `TransformStream`

- RED: `pipe(s, transformStream)` y mezclado con funciones.
- GREEN: detectar `instanceof TransformStream` y hacer `pipeThrough`.

### Paso 2.8 — `toBuffer(stream)` → `Uint8Array`

- RED: mezcla de `string | Buffer | Uint8Array`, bytes UTF-8 multi-byte.
- GREEN: reduce concatenando.

### Paso 2.9 — `lines(stream)` y `csvLines(stream)`

- RED: chunks fragmentados, `\r\n` y `\n`, comillas para CSV.
- GREEN: adaptar la lógica del `lineTransformer` del PR.

### Paso 2.10 — README "Working with Node streams"

- Sin TDD: documentar `Readable.toWeb()`, `safeQueryRunner` como receta, ejemplo CSV end-to-end.

### Paso 2.11 — Generator `iterate(fn)` con sentinela `null`

- RED: `iterate(i => i < 5 ? i : null)` → `[0,1,2,3,4]`.
- GREEN: async generator que para cuando `fn(i) === null`.

### Paso 2.12 — JSDoc unify "consuming"

Añadir `NOTE: This consumes the stream...` a `at`, `some`, `every`, `includes`, `indexOf`, `join`, `count`.

---

## Fase 3 — Packaging

### Paso 3.1 — Subpath exports

`@sgmonda/streamfu/map`, `/filter`, etc. en `package.json` y `deno.json`.

---

## Fase 4 — Tests de profundidad

### Paso 4.1 — Property-based tests con `fast-check`

Propiedades equivalencia stream/array para `map`, `filter`, `reduce`, `concat`, `take`.

### Paso 4.2 — Test integración Node real

NDJSON grande con `fs.createReadStream` → `Readable.toWeb` → pipeline completa.

---

## Fase 5 — Release v0.8.0

1. Bump `deno.json` → `0.8.0`.
2. `CHANGELOG.md` con Added / Changed / Fixed.
3. Merge → CI publica.
4. GitHub Release con highlights.

---

## Fase 6 — Simplificar PR `platform-back#5907`

Eliminar de `src/providers/streams/`: `array2stream`, `cloneStream`, `concat`, `filter`, `map`, `reduce`, `safeStream`, `streamize`, `toArray`, `toBuffer`, `transformers/lineTransformer`.
Reducir `collect` a 5 líneas con `tap` + `concat`.
Mantener: `safeQueryRunner`, `merge` (object-merge), `toCsv`, `csvTransformer`, `createTransformer`.

Resultado estimado: PR pasa de ~1.300 LOC añadidas a <300.
