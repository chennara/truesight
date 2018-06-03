// Prevents an error from being swallowed.
export default function errorify(promise) {
  return promise.then(() => {
    const errorOccurred = false;

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });
}
