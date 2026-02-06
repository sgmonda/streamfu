import { TransformStream } from "./system/stream.ts"

type ITransformer<Tin, Tout> = (chunk: Tin, i: number) => Tout | Promise<Tout>

/**
 * Creates a new stream by applying one or more transform functions to each chunk of the input stream.
 * When many functions are provided, they are applied in order. Types are inferred through the chain:
 * the first transformer infers its input from the stream, and each subsequent transformer infers its
 * input from the previous transformer's output.
 *
 * Type inference is supported for up to 9 chained transformers, which covers virtually all practical
 * use cases. Beyond that, types fall back to `any` (a TypeScript limitation shared by RxJS, fp-ts, etc.).
 *
 * @param readable The input stream
 * @param transformers One or more transform functions to apply to the input chunks
 * @returns A readable stream whose chunks are the result of applying the transform functions (sequentially) to the input chunks
 *
 * @example const asInt = map(readable, parseInt)
 * @example const asUpperCase = map(readable, item => item.toUpperCase())
 * @example const asDouble = map(readable, item => item * 2)
 * @example const asLength = map(readable, item => item.length)
 * @example const asJSONobj = map(readable, JSON.stringify, JSON.parse)
 */
export function map<A, B>(readable: ReadableStream<A>, fn1: ITransformer<A, B>): ReadableStream<B>
export function map<A, B, C>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
): ReadableStream<C>
export function map<A, B, C, D>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
  fn3: ITransformer<C, D>,
): ReadableStream<D>
export function map<A, B, C, D, E>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
  fn3: ITransformer<C, D>,
  fn4: ITransformer<D, E>,
): ReadableStream<E>
export function map<A, B, C, D, E, F>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
  fn3: ITransformer<C, D>,
  fn4: ITransformer<D, E>,
  fn5: ITransformer<E, F>,
): ReadableStream<F>
export function map<A, B, C, D, E, F, G>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
  fn3: ITransformer<C, D>,
  fn4: ITransformer<D, E>,
  fn5: ITransformer<E, F>,
  fn6: ITransformer<F, G>,
): ReadableStream<G>
export function map<A, B, C, D, E, F, G, H>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
  fn3: ITransformer<C, D>,
  fn4: ITransformer<D, E>,
  fn5: ITransformer<E, F>,
  fn6: ITransformer<F, G>,
  fn7: ITransformer<G, H>,
): ReadableStream<H>
export function map<A, B, C, D, E, F, G, H, I>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
  fn3: ITransformer<C, D>,
  fn4: ITransformer<D, E>,
  fn5: ITransformer<E, F>,
  fn6: ITransformer<F, G>,
  fn7: ITransformer<G, H>,
  fn8: ITransformer<H, I>,
): ReadableStream<I>
export function map<A, B, C, D, E, F, G, H, I, J>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
  fn3: ITransformer<C, D>,
  fn4: ITransformer<D, E>,
  fn5: ITransformer<E, F>,
  fn6: ITransformer<F, G>,
  fn7: ITransformer<G, H>,
  fn8: ITransformer<H, I>,
  fn9: ITransformer<I, J>,
): ReadableStream<J>
// deno-lint-ignore no-explicit-any
export function map(readable: ReadableStream<any>, ...transformers: ITransformer<any, any>[]): ReadableStream<any>
// deno-lint-ignore no-explicit-any
export function map(readable: ReadableStream<any>, ...transformers: ITransformer<any, any>[]): ReadableStream<any> {
  let i = 0
  // deno-lint-ignore no-explicit-any
  const applyTransformers = async (chunk: any): Promise<any> => {
    let value: unknown = chunk
    for (const fn of transformers) {
      value = await fn(value, i++)
    }
    return value
  }
  return readable.pipeThrough(
    new TransformStream({
      transform: async (chunk, controller) => {
        const value = await applyTransformers(chunk)
        controller.enqueue(value)
      },
    }),
  )
}
