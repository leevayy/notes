import { HasPosition } from "../types";

export function toSortedByPosition<T extends HasPosition>(iterable: T[]) {
  if (iterable.length === 0) {
    return [];
  }

  const sorted = [...iterable];

  return sorted.sort((el1, el2) => el1.position - el2.position);
}

export function getId() {
  return String(parseInt(String(Math.random() * 10000000), 10));
}
