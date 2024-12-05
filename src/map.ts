import { TransformStream } from "./util/stream.ts"

type ITransformer<Tin, Tout> = (chunk: Tin) => Tout | Promise<Tout>

/**
 * Creates a new stream by applying a transform function to each chunk of the input stream.
 *
 * @param fn The transform function, that will be applied to each chunk
 * @returns A readable stream whose chunks are the result of applying the transform function to the input chunks
 *
 * @example const asInt = map<string, number>(parseInt);
 * @example const asUpperCase = map<string, string>(item => item.toUpperCase());
 * @example const asDouble = map<number, number>(item => item * 2);
 * @example const asLength = map<string, number>(item => item.length);
 * @example const asJSON = map<unknown, string>(JSON.stringify);
 */
export const map = <Tin = unknown, Tout = Tin>(fn: ITransformer<Tin, Tout>): ReadableWritablePair<Tout> =>
  new TransformStream<Tin, Tout>({
    transform: async (chunk, controller) => {
      const value = await fn(chunk)
      controller.enqueue(value)
    },
  })
