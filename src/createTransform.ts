import { TransformStream } from './core.ts';
import { streamize } from "./streamize.ts";

export const createTransform = <Tin = unknown, Tout = Tin>(fn: (chunk: Tin) => Promise<Tout>): ReadableWritablePair<Tout> => {
  const transform: TransformerTransformCallback<Tin, Tout> = async (chunk, controller) => {
    const value = await fn(chunk);
    console.log('transformed value:', chunk, '->', value);
    controller.enqueue(value);
  };
  console.log('TRANSFORMS TREAM', TransformStream)
  const transformer = new TransformStream<Tin, Tout>({ transform });
  return transformer;
}

const transformer = createTransform<string, number>(async (chunk) => {
  return parseInt(chunk);
});

// Example

const example = streamize(['1', '2', '3', '4', '5']);
const reader = example.pipeThrough(transformer).getReader();

const result: number[] = [];
reader.read().then(async function process({ done, value }): Promise<number | void> {
  if (done) {
    console.log('result:', result);
    return;
  }
  result.push(value);
  return reader.read().then(process);
})