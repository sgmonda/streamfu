/**
 * A pipe function that takes a readable stream and returns a new readable stream with transformed chunks.
 *
 * @template Tin The input stream chunk type
 * @template Tout The output stream chunk type
 */
type IPipeFn<Tin, Tout> = (readable: ReadableStream<Tin>) => ReadableStream<Tout>

/**
 * Passes a readable stream through 1 transform function.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @returns A readable stream of B chunks
 */
export function pipe<A, B>(readable: ReadableStream<A>, fn1: IPipeFn<A, B>): ReadableStream<B>
/**
 * Passes a readable stream through 2 chained transform functions.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @param fn2 Transform from B to C
 * @returns A readable stream of C chunks
 */
export function pipe<A, B, C>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
): ReadableStream<C>
/**
 * Passes a readable stream through 3 chained transform functions.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @param fn2 Transform from B to C
 * @param fn3 Transform from C to D
 * @returns A readable stream of D chunks
 */
export function pipe<A, B, C, D>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
  fn3: IPipeFn<C, D>,
): ReadableStream<D>
/**
 * Passes a readable stream through 4 chained transform functions.
 * Types are inferred through the chain.
 *
 * @param readable The input stream
 * @param fn1 Transform from A to B
 * @param fn2 Transform from B to C
 * @param fn3 Transform from C to D
 * @param fn4 Transform from D to E
 * @returns A readable stream of E chunks
 */
export function pipe<A, B, C, D, E>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
  fn3: IPipeFn<C, D>,
  fn4: IPipeFn<D, E>,
): ReadableStream<E>
/**
 * Passes a readable stream through 5 chained transform functions.
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
export function pipe<A, B, C, D, E, F>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
  fn3: IPipeFn<C, D>,
  fn4: IPipeFn<D, E>,
  fn5: IPipeFn<E, F>,
): ReadableStream<F>
/**
 * Passes a readable stream through 6 chained transform functions.
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
export function pipe<A, B, C, D, E, F, G>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
  fn3: IPipeFn<C, D>,
  fn4: IPipeFn<D, E>,
  fn5: IPipeFn<E, F>,
  fn6: IPipeFn<F, G>,
): ReadableStream<G>
/**
 * Passes a readable stream through 7 chained transform functions.
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
export function pipe<A, B, C, D, E, F, G, H>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
  fn3: IPipeFn<C, D>,
  fn4: IPipeFn<D, E>,
  fn5: IPipeFn<E, F>,
  fn6: IPipeFn<F, G>,
  fn7: IPipeFn<G, H>,
): ReadableStream<H>
/**
 * Passes a readable stream through 8 chained transform functions.
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
export function pipe<A, B, C, D, E, F, G, H, I>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
  fn3: IPipeFn<C, D>,
  fn4: IPipeFn<D, E>,
  fn5: IPipeFn<E, F>,
  fn6: IPipeFn<F, G>,
  fn7: IPipeFn<G, H>,
  fn8: IPipeFn<H, I>,
): ReadableStream<I>
/**
 * Passes a readable stream through 9 chained transform functions.
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
export function pipe<A, B, C, D, E, F, G, H, I, J>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
  fn3: IPipeFn<C, D>,
  fn4: IPipeFn<D, E>,
  fn5: IPipeFn<E, F>,
  fn6: IPipeFn<F, G>,
  fn7: IPipeFn<G, H>,
  fn8: IPipeFn<H, I>,
  fn9: IPipeFn<I, J>,
): ReadableStream<J>
// deno-lint-ignore no-explicit-any
export function pipe(readable: ReadableStream<any>, ...fns: IPipeFn<any, any>[]): ReadableStream<any>
// deno-lint-ignore no-explicit-any
export function pipe(readable: ReadableStream<any>, ...fns: IPipeFn<any, any>[]): ReadableStream<any> {
  return fns.reduce((prev, fn) => fn(prev), readable)
}
