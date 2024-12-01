export function toSortedByPosition<T extends { position: number }>(
  iterable: T[],
) {
  return iterable.toSorted((el1, el2) => el1.position - el2.position);
}
