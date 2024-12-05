import { TransformStream } from './util/stream.ts';

type ITransformer<Tin, Tout> = (chunk: Tin) => Tout | Promise<Tout>;

/**
 * Creates a stream transformer from a given transform function
 * 
 * @param fn The transform function, that will be applied to each chunk
 * @returns A readable stream whose chunks are the result of applying the transform function to the input chunks
 * @example const toInt = createTransform<string, number>(parseInt);
 */
export const createTransform = <Tin = unknown, Tout = Tin>(fn: ITransformer<Tin, Tout>): ReadableWritablePair<Tout> =>
  new TransformStream<Tin, Tout>({
    transform: async (chunk, controller) => {
      const value = await fn(chunk);
      controller.enqueue(value);
    }
  });
