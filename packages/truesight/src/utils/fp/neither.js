// @flow

// Either an object of type L or an object of type R.
export type Either<L, R> = L | R;

// Either an Error object or an object of type T.
export type Try<T> = Either<Error, T>;

export function tryFn<T>(fn: () => T): Try<T> {
  try {
    return fn();
  } catch (error) {
    return error;
  }
}
