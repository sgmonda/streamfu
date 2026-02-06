import { TransformStream } from "./system/stream.ts"

/**
 * A transform function that takes a chunk and its index, and returns a transformed value (sync or async).
 *
 * @template Tin The input chunk type
 * @template Tout The output chunk type
 */
type ITransformer<Tin, Tout> = (chunk: Tin, i: number) => Tout | Promise<Tout>

/**
 * Applies 1 transform function to each chunk of the input stream.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @returns A readable stream of B chunks
 */
export function map<A, B>(readable: ReadableStream<A>, fn1: ITransformer<A, B>): ReadableStream<B>
/**
 * Applies 2 chained transform functions to each chunk of the input stream.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @param fn2 Transform from B to C
 * @returns A readable stream of C chunks
 */
export function map<A, B, C>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
): ReadableStream<C>
/**
 * Applies 3 chained transform functions to each chunk of the input stream.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @param fn2 Transform from B to C
 * @param fn3 Transform from C to D
 * @returns A readable stream of D chunks
 */
export function map<A, B, C, D>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
  fn3: ITransformer<C, D>,
): ReadableStream<D>
/**
 * Applies 4 chained transform functions to each chunk of the input stream.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @param fn2 Transform from B to C
 * @param fn3 Transform from C to D
 * @param fn4 Transform from D to E
 * @returns A readable stream of E chunks
 */
export function map<A, B, C, D, E>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
  fn3: ITransformer<C, D>,
  fn4: ITransformer<D, E>,
): ReadableStream<E>
/**
 * Applies 5 chained transform functions to each chunk of the input stream.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @param fn2 Transform from B to C
 * @param fn3 Transform from C to D
 * @param fn4 Transform from D to E
 * @param fn5 Transform from E to F
 * @returns A readable stream of F chunks
 */
export function map<A, B, C, D, E, F>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
  fn3: ITransformer<C, D>,
  fn4: ITransformer<D, E>,
  fn5: ITransformer<E, F>,
): ReadableStream<F>
/**
 * Applies 6 chained transform functions to each chunk of the input stream.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @param fn2 Transform from B to C
 * @param fn3 Transform from C to D
 * @param fn4 Transform from D to E
 * @param fn5 Transform from E to F
 * @param fn6 Transform from F to G
 * @returns A readable stream of G chunks
 */
export function map<A, B, C, D, E, F, G>(
  readable: ReadableStream<A>,
  fn1: ITransformer<A, B>,
  fn2: ITransformer<B, C>,
  fn3: ITransformer<C, D>,
  fn4: ITransformer<D, E>,
  fn5: ITransformer<E, F>,
  fn6: ITransformer<F, G>,
): ReadableStream<G>
/**
 * Applies 7 chained transform functions to each chunk of the input stream.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @param fn2 Transform from B to C
 * @param fn3 Transform from C to D
 * @param fn4 Transform from D to E
 * @param fn5 Transform from E to F
 * @param fn6 Transform from F to G
 * @param fn7 Transform from G to H
 * @returns A readable stream of H chunks
 */
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
/**
 * Applies 8 chained transform functions to each chunk of the input stream.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @param fn2 Transform from B to C
 * @param fn3 Transform from C to D
 * @param fn4 Transform from D to E
 * @param fn5 Transform from E to F
 * @param fn6 Transform from F to G
 * @param fn7 Transform from G to H
 * @param fn8 Transform from H to I
 * @returns A readable stream of I chunks
 */
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
/**
 * Applies 9 chained transform functions to each chunk of the input stream.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @param fn2 Transform from B to C
 * @param fn3 Transform from C to D
 * @param fn4 Transform from D to E
 * @param fn5 Transform from E to F
 * @param fn6 Transform from F to G
 * @param fn7 Transform from G to H
 * @param fn8 Transform from H to I
 * @param fn9 Transform from I to J
 * @returns A readable stream of J chunks
 */
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
  const ts = new TransformStream({
    transform: async (chunk: unknown, controller: TransformStreamDefaultController) => {
      try {
        const value = await applyTransformers(chunk)
        controller.enqueue(value)
      } catch (e) {
        controller.error(e)
      }
    },
  })
  readable.pipeTo(ts.writable).catch(() => {})
  return ts.readable
}
