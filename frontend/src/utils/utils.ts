export function toSortedByPosition<T extends { position: number }>(
  iterable: T[],
) {
  if (iterable.length === 0) {
    return [];
  }

  const sorted = [...iterable];

  return sorted.sort((el1, el2) => el1.position - el2.position);
}

export function getId() {
  return parseInt(String(Math.random() * 10000000), 10);
}
