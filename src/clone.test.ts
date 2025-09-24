import { assertEquals } from "asserts/equals"
import { clone } from "./clone.ts"

async function collect<T>(iter: AsyncIterable<T>): Promise<T[]> {
  const result: T[] = []
  for await (const v of iter) result.push(v)
  return result
}

Deno.test("clone() - correctly clones an async iterable", async () => {
  async function* gen() {
    yield 1
    yield 2
    yield 3
  }
  const a = clone(gen())
  const b = clone(gen())
  assertEquals(await collect(a), [1, 2, 3])
  assertEquals(await collect(b), [1, 2, 3])
})

Deno.test("clone() - clones can advance at different rates", async () => {
  async function* gen() {
    yield 10
    yield 20
    yield 30
  }
  const a = clone(gen())
  const b = clone(gen())
  const c = clone(gen())
  const ita = a[Symbol.asyncIterator]()
  const itb = b[Symbol.asyncIterator]()
  // a consumes one
  assertEquals((await ita.next()).value, 10)
  // b consumes two
  assertEquals((await itb.next()).value, 10)
  assertEquals((await itb.next()).value, 20)
  // c consumes all
  assertEquals(await collect(c), [10, 20, 30])
  // a continues
  assertEquals((await ita.next()).value, 20)
  assertEquals((await ita.next()).value, 30)
  assertEquals((await ita.next()).done, true)
  // b continues
  assertEquals((await itb.next()).value, 30)
  assertEquals((await itb.next()).done, true)
})

Deno.test("clone() - empty iterable", async () => {
  async function* gen() {}
  const a = clone(gen())
  const b = clone(gen())
  assertEquals(await collect(a), [])
  assertEquals(await collect(b), [])
})
