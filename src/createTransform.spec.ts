import { assertEquals } from "asserts";
import { createTransform } from "./createTransform.ts";
import { createReadable } from "./createReadable.ts";

const TEST_CASES = [{
  title: 'Numbers list',
  items: [1, 2, 3],
  transform: (item: number) => item * 2,
  expected: [2, 4, 6]
}]

Deno.test("createTansform()", async ({ step }) => {
  TEST_CASES.forEach(async ({ items, transform, expected }) => {
    const transformer = createTransform<number, number>(transform);
    const example = createReadable(items);
    const reader = example.pipeThrough(transformer).getReader();
    const result: number[] = [];
    reader.read().then(async function process({ done, value }): Promise<number | void> {
      if (done) {
        assertEquals(result, expected);
        return;
      }
      result.push(value);
      return reader.read().then(process);
    })
  })

  await step('case 1', async () => {
    assertEquals(3, 3);
  })
  await step('case 2', async () => {
    assertEquals(3, 3);
  })
  await step('case 3', async () => {
    assertEquals(3, 3);
  })
})
