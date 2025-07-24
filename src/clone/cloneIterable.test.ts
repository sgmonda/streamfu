import { assertEquals } from "asserts/equals"
import { cloneIterable } from "./cloneIterable.ts"

Deno.test("cloneIterable() - correctly clones a synchronous iterable", () => {
  const original = [1, 2, 3, 4, 5]
  const [a, b] = cloneIterable(original, 2)
  assertEquals([...a], original)
  assertEquals([...b], original)
})

Deno.test("cloneIterable() - clones can advance at different rates", () => {
  const original = [10, 20, 30]
  const [a, b, c] = cloneIterable(original, 3)
  const ita = a[Symbol.iterator]()
  const itb = b[Symbol.iterator]()
  // a consumes one
  assertEquals(ita.next().value, 10)
  // b consumes two
  assertEquals(itb.next().value, 10)
  assertEquals(itb.next().value, 20)
  // c consumes all
  assertEquals([...c], [10, 20, 30])
  // a continues
  assertEquals(ita.next().value, 20)
  assertEquals(ita.next().value, 30)
  assertEquals(ita.next().done, true)
  // b continues
  assertEquals(itb.next().value, 30)
  assertEquals(itb.next().done, true)
})

Deno.test("cloneIterable() - empty iterable", () => {
  const [a, b] = cloneIterable([], 2)
  assertEquals([...a], [])
  assertEquals([...b], [])
})
