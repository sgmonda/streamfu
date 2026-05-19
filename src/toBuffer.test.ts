import { assertEquals } from "asserts"
import { createReadable } from "./createReadable.ts"
import { toBuffer } from "./toBuffer.ts"

const enc = new TextEncoder()
const dec = new TextDecoder()

Deno.test("toBuffer()", async ({ step }) => {
  await step("returns an empty Uint8Array for an empty stream", async () => {
    const result = await toBuffer(createReadable([] as Uint8Array[]))
    assertEquals(result, new Uint8Array(0))
  })

  await step("concatenates Uint8Array chunks", async () => {
    const result = await toBuffer(createReadable([new Uint8Array([1, 2]), new Uint8Array([3, 4, 5])]))
    assertEquals(result, new Uint8Array([1, 2, 3, 4, 5]))
  })

  await step("encodes string chunks as UTF-8 and concatenates", async () => {
    const result = await toBuffer(createReadable(["hello, ", "world"]))
    assertEquals(dec.decode(result), "hello, world")
  })

  await step("handles multi-byte UTF-8 codepoints when fragmented across chunks", async () => {
    // "héllo" → ['h', 0xC3, 0xA9, 'l', 'l', 'o'] across two chunks splitting é
    const partA = enc.encode("h")
    const eAcuteBytes = enc.encode("é")
    const partB = enc.encode("llo")
    const result = await toBuffer(createReadable([partA, eAcuteBytes, partB]))
    assertEquals(dec.decode(result), "héllo")
  })

  await step("mixes strings and Uint8Arrays in the same stream", async () => {
    const result = await toBuffer(createReadable(["a", new Uint8Array([0x62]), "c"] as Array<string | Uint8Array>))
    assertEquals(dec.decode(result), "abc")
  })
})
