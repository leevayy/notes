import { ListDto } from "@dto/interfaces";
import { useUnit } from "effector-react";

import { getId } from "../../utils/utils";
import styles from "./MakeNewList.module.css";
import { listCreated } from "./model";

type MakeNewListProps = {
  position: ListDto["position"];
};

export default function MakeNewList({ position }: MakeNewListProps) {
  const createList = useUnit(listCreated);

  const emptyList: ListDto = {
    name: "",
    position,
    cards: [],
    id: getId(),
  };

  function handleClick() {
    createList(emptyList);
  }

  return (
    <button className={styles.make_new_list} onClick={handleClick}>
      Make New List
    </button>
  );
}
