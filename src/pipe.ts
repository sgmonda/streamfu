type IPipeFn<Tin, Tout> = (readable: ReadableStream<Tin>) => ReadableStream<Tout>

/**
 * Passes a readable stream through a series of functions, each taking the previous output as input,
 * and returning a new readable stream for the next. Types are inferred through the chain: each
 * function's input is inferred from the previous function's output.
 *
 * Type inference is supported for up to 9 chained functions, which covers virtually all practical
 * use cases. Beyond that, types fall back to `any` (a TypeScript limitation shared by RxJS, fp-ts, etc.).
 *
 * @param readable A readable stream to be passed to the first function
 * @param fns A list of functions, each taking a readable stream and returning a new readable stream
 * @returns The last readable stream after applying all transformations
 *
 * @example const result = pipe(readable, r => filter(r, num => num % 2 === 0), r => map(r, num => num.toString()))
 */
export function pipe<A, B>(readable: ReadableStream<A>, fn1: IPipeFn<A, B>): ReadableStream<B>
export function pipe<A, B, C>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
): ReadableStream<C>
export function pipe<A, B, C, D>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
  fn3: IPipeFn<C, D>,
): ReadableStream<D>
export function pipe<A, B, C, D, E>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
  fn3: IPipeFn<C, D>,
  fn4: IPipeFn<D, E>,
): ReadableStream<E>
export function pipe<A, B, C, D, E, F>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
  fn3: IPipeFn<C, D>,
  fn4: IPipeFn<D, E>,
  fn5: IPipeFn<E, F>,
): ReadableStream<F>
export function pipe<A, B, C, D, E, F, G>(
  readable: ReadableStream<A>,
  fn1: IPipeFn<A, B>,
  fn2: IPipeFn<B, C>,
  fn3: IPipeFn<C, D>,
  fn4: IPipeFn<D, E>,
  fn5: IPipeFn<E, F>,
  fn6: IPipeFn<F, G>,
): ReadableStream<G>
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
