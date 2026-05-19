import { assertEquals } from "asserts"
import { createReadable } from "./createReadable.ts"
import { csvLines, lines } from "./lines.ts"
import { list } from "./list.ts"

Deno.test("lines()", async ({ step }) => {
  await step("splits a single chunk by \\n", async () => {
    assertEquals(await list(lines(createReadable(["a\nb\nc"]))), ["a", "b", "c"])
  })

  await step("emits the trailing remainder without a final newline", async () => {
    assertEquals(await list(lines(createReadable(["a\nb\nc"]))), ["a", "b", "c"])
  })

  await step("does not emit a trailing empty line when the input ends with \\n", async () => {
    assertEquals(await list(lines(createReadable(["a\nb\n"]))), ["a", "b"])
  })

  await step("stitches lines split across chunks", async () => {
    assertEquals(await list(lines(createReadable(["he", "llo\nwor", "ld"]))), ["hello", "world"])
  })

  await step("normalizes \\r\\n line endings", async () => {
    assertEquals(await list(lines(createReadable(["a\r\nb\r\nc"]))), ["a", "b", "c"])
  })

  await step("handles empty input", async () => {
    assertEquals(await list(lines(createReadable([] as string[]))), [])
  })

  await step("emits empty strings for consecutive newlines", async () => {
    assertEquals(await list(lines(createReadable(["a\n\nb"]))), ["a", "", "b"])
  })

  await step("decodes Uint8Array chunks as UTF-8", async () => {
    const enc = new TextEncoder()
    const stream = createReadable([enc.encode("first\nsec"), enc.encode("ond\n")])
    assertEquals(await list(lines(stream)), ["first", "second"])
  })
})

Deno.test("csvLines()", async ({ step }) => {
  await step("treats newlines inside double quotes as part of the field", async () => {
    const stream = createReadable([`a,b,c\n"d\ne",f,g\nh,i,j`])
    assertEquals(await list(csvLines(stream)), [`a,b,c`, `"d\ne",f,g`, `h,i,j`])
  })

  await step("handles escaped quotes inside fields", async () => {
    const stream = createReadable([`name,quote\n"Bob","He said ""hi"""\nAlice,Hello`])
    assertEquals(await list(csvLines(stream)), [`name,quote`, `"Bob","He said ""hi"""`, `Alice,Hello`])
  })

  await step("stitches quoted lines split across chunks", async () => {
    const stream = createReadable([`"open\n`, `quote\nstill open"`, `,end\nplain`])
    assertEquals(await list(csvLines(stream)), [`"open\nquote\nstill open",end`, `plain`])
  })
})
