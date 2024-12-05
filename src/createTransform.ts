import { TransformStream } from './util/stream.ts';

type ITransformer<Tin, Tout> = (chunk: Tin) => Tout | Promise<Tout>;

/**
 * Creates a stream transformer from a given transform function. Every chunk written to the stream will be transformed by the function.
 * 
 * @param fn The transform function, that will be applied to each chunk
 * @returns A readable stream whose chunks are the result of applying the transform function to the input chunks
 * 
 * @example const toInt = createTransform<string, number>(parseInt);
 * @example const toUpperCase = createTransform<string, string>(item => item.toUpperCase());
 * @example const double = createTransform<number, number>(item => item * 2);
 * @example const toLength = createTransform<string, number>(item => item.length);
 * @example const toJSON = createTransform<unknown, string>(JSON.stringify);
 */
export const createTransform = <Tin = unknown, Tout = Tin>(fn: ITransformer<Tin, Tout>): ReadableWritablePair<Tout> =>
  new TransformStream<Tin, Tout>({
    transform: async (chunk, controller) => {
      const value = await fn(chunk);
      controller.enqueue(value);
    }
  });
