export default async function asyncCollect(iterable) {
  const result = [];

  for await (const element of iterable) {
    result.push(element);
  }

  return result;
}
