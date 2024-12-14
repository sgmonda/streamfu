import { assertEquals } from "asserts/equals"
import { createReadable } from "./createReadable.ts"
import { filter } from "./filter.ts"
import { flatMap } from "./flatMap.ts"
import { list } from "./list.ts"
import { map } from "./map.ts"
import { pipe } from "./pipe.ts"
import { slice } from "./slice.ts"

Deno.test("pipe()", async () => {
  const stream = pipe(
    createReadable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    (r) => flatMap(r, (chunk) => [chunk, chunk]),
    (r) => slice(r, 2),
    (r) => filter(r, (chunk) => chunk < 4),
    (r) => map(r, (chunk) => `(${chunk})`),
  )
  const observed = await list(stream)
  assertEquals(observed, ["(2)", "(2)", "(3)", "(3)"])
})
