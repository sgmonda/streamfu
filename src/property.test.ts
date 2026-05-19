import { assertEquals } from "asserts"
import fc from "fast-check"
import { concat } from "./concat.ts"
import { count } from "./count.ts"
import { createReadable } from "./createReadable.ts"
import { drop } from "./drop.ts"
import { filter } from "./filter.ts"
import { list } from "./list.ts"
import { map } from "./map.ts"
import { reduce } from "./reduce.ts"
import { take } from "./take.ts"

const arbArray = fc.array(fc.integer({ min: -1000, max: 1000 }), { maxLength: 60 })

Deno.test("property: list(createReadable(arr)) === arr", () => {
  fc.assert(fc.asyncProperty(arbArray, async (arr) => {
    assertEquals(await list(createReadable(arr)), arr)
  }))
})

Deno.test("property: map mirrors Array.prototype.map for pure functions", () => {
  const fns = [
    (n: number) => n * 2,
    (n: number) => n + 1,
    (n: number) => -n,
    (n: number) => n & 0xff,
  ]
  fc.assert(fc.asyncProperty(arbArray, fc.constantFrom(...fns), async (arr, fn) => {
    assertEquals(await list(map(createReadable(arr), fn)), arr.map(fn))
  }))
})

Deno.test("property: filter mirrors Array.prototype.filter for pure predicates", () => {
  const preds = [
    (n: number) => n > 0,
    (n: number) => n % 2 === 0,
    (n: number) => Math.abs(n) < 100,
    (_n: number) => true,
    (_n: number) => false,
  ]
  fc.assert(fc.asyncProperty(arbArray, fc.constantFrom(...preds), async (arr, pred) => {
    assertEquals(await list(filter(createReadable(arr), pred)), arr.filter(pred))
  }))
})

Deno.test("property: reduce mirrors Array.prototype.reduce", () => {
  fc.assert(fc.asyncProperty(arbArray, fc.integer({ min: -100, max: 100 }), async (arr, init) => {
    const sumStream = await reduce(createReadable(arr), (acc: number, n: number) => acc + n, init)
    const sumArray = arr.reduce((acc: number, n: number) => acc + n, init)
    assertEquals(sumStream, sumArray)
  }))
})

Deno.test("property: count(createReadable(arr)) === arr.length", () => {
  fc.assert(fc.asyncProperty(arbArray, async (arr) => {
    assertEquals(await count(createReadable(arr)), arr.length)
  }))
})

Deno.test("property: concat(a, b) emits [...a, ...b]", () => {
  fc.assert(fc.asyncProperty(arbArray, arbArray, async (a, b) => {
    assertEquals(await list(concat(createReadable(a), createReadable(b))), [...a, ...b])
  }))
})

Deno.test("property: take(arr, n) === arr.slice(0, n)", () => {
  fc.assert(fc.asyncProperty(arbArray, fc.integer({ min: 0, max: 100 }), async (arr, n) => {
    assertEquals(await list(take(createReadable(arr), n)), arr.slice(0, n))
  }))
})

Deno.test("property: drop(arr, n) === arr.slice(n)", () => {
  fc.assert(fc.asyncProperty(arbArray, fc.integer({ min: 0, max: 100 }), async (arr, n) => {
    assertEquals(await list(drop(createReadable(arr), n)), arr.slice(n))
  }))
})
