export default async function asyncMap<T, R>(
  array: readonly T[],
  transform: (item: T) => R | Promise<R>
): Promise<R[]> {
  return Promise.all(array.map(transform));
}