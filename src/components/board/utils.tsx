import { HasPosition } from "../../types";

export function cookSetHasPositionPosition<T extends HasPosition>(
  array: T[],
  setArrayState: (value: React.SetStateAction<T[]>) => void
) {
  return function setHasPositionPosition(
    oldPosition: number,
    newPosition: number
  ) {
    let newArray = [...array];

    let item = newArray.splice(oldPosition, 1)[0];
    newArray.splice(newPosition, 0, item);

    for (let i = 0; i < newArray.length; i++) {
      newArray[i].position = i;
    }

    setArrayState(newArray);
  };
}
