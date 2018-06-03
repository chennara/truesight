// @flow

export async function asyncTry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    return Promise.reject(error);
  }
}
