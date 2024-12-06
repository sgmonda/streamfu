import { zip } from "./zip.ts"
import { assertEquals } from "asserts/equals"
import { list } from "./list.ts"
import { createReadable } from "./createReadable.ts"

const TEST_CASES = [{
  title: "no streams",
  streams: [],
  expected: [],
}, {
  title: "one stream",
  streams: [
    createReadable([1, 2, 3]),
  ],
  expected: [[1], [2], [3]],
}, {
  title: "one empty stream",
  streams: [
    createReadable([]),
  ],
  expected: [],
}, {
  title: "many streams",
  streams: [
    createReadable([1, 2, 3]),
    createReadable(["a", "b", "c", "d"]),
    createReadable([true, false, false, true, false]),
  ],
  expected: [[1, "a", true], [2, "b", false], [3, "c", false]],
}, {
  title: "many empty streams",
  streams: [
    createReadable([]),
    createReadable([]),
    createReadable([]),
  ],
  expected: [],
}]

Deno.test("zip()", async ({ step }) => {
  for (const { title, streams, expected } of TEST_CASES) {
    await step(title, async () => {
      const zipped = zip(...streams)
      assertEquals(await list(zipped), expected)
    })
  }
})
