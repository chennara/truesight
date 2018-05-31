export default async function collect(iterable) {
  const result = [];

  for await (const element of iterable) {
    result.push(element);
  }

  return result;
}
