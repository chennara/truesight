// @flow

// Reference: https://github.com/rauschma/async-iter-demo/blob/master/src/async_iter_tools.js

// Settle functions for the yielded Promise objects in an asynchronous generator.
type PromiseSettleFunctions<T> = {|
  resolve: (IteratorResult<T>) => void,
  reject: (string) => void,
|};

// An iterator element.
type IteratorResult<T> = {| done: false, value: T |} | {| done: true |};

// An asynchronous task queue.
export class AsyncQueue<T> {
  values: T[];
  settlers: PromiseSettleFunctions<T>[];
  closed: boolean;

  constructor() {
    this.values = [];
    this.settlers = [];
    this.closed = false;
  }

  enqueue(value: T) {
    if (this.closed) {
      throw new Error('unable to enqueue an item onto a closed queue');
    } else if (this.settlers.length === 0) {
      this.values.push(value);
    } else {
      const settler = this.settlers.shift();

      if (value instanceof Error) {
        settler.reject(value.message);
      } else {
        settler.resolve({ done: false, value });
      }
    }
  }

  // $FlowFixMe: Flow doesn't support computed property names
  [Symbol.asyncIterator](): AsyncQueue<T> {
    return this;
  }

  next(): Promise<IteratorResult<T>> {
    if (this.values.length > 0) {
      const value = this.values.shift();

      if (value instanceof Error) {
        return Promise.reject(value);
      }

      return Promise.resolve({ done: false, value });
    } else if (this.closed) {
      return Promise.resolve({ done: true });
    }

    return new Promise((resolve, reject) => {
      this.settlers.push({ resolve, reject });
    });
  }

  close() {
    if (this.settlers.length > 0) {
      const settler = this.settlers.shift();
      settler.resolve({ done: true });
    }

    this.closed = true;
  }
}
