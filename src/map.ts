import { TransformStream } from "./system/stream.ts"

type ITransformer<Tin, Tout> = (chunk: Tin) => Tout | Promise<Tout>

/**
 * Creates a new stream by applying one or more transform functions to each chunk of the input stream.
 * When many functions are provided, they are applied in order.
 *
 * @param readable The input stream
 * @param transformers One or more transform functions to apply to the input chunks
 * @returns A readable stream whose chunks are the result of applying the transform functions (sequentially) to the input chunks
 *
 * @example const asInt = map<string, number>(readable, parseInt);
 * @example const asUpperCase = map<string, string>(readable, item => item.toUpperCase());
 * @example const asDouble = map<number, number>(readable, item => item * 2);
 * @example const asLength = map<string, number>(readable, item => item.length);
 * @example const asJSONobj = map<unknown, string>(readable, JSON.stringify, JSON.parse);
 */
export const map = <Tin = unknown, Tout = Tin>(
  readable: ReadableStream<Tin>,
  // deno-lint-ignore no-explicit-any
  ...transformers: ITransformer<any, any>[] // TODO Find a way to check pipe types statically
): ReadableStream<Tout> => {
  const applyTransformers = async (chunk: Tin): Promise<Tout> => {
    let value: unknown = chunk
    for (const fn of transformers) {
      value = await fn(value)
    }
    return value as Tout
  }
  return readable.pipeThrough(
    new TransformStream<Tin, Tout>({
      transform: async (chunk, controller) => {
        const value = await applyTransformers(chunk)
        controller.enqueue(value)
      },
    }),
  )
}
