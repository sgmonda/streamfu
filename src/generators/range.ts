export function* range(min: number, max: number, step: number = 1) {
  if (min < max) {
    for (let i = min; i <= max; i += step) {
      yield i
    }
  } else {
    for (let i = min; i >= max; i += step) {
      yield i
    }
  }
}
