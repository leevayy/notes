import { EntityId, ListDto } from "@dto/interfaces";
import { useUnit } from "effector-react";
import { listApi } from "src/features/List/model";

import styles from "./MakeNewList.module.css";

type MakeNewListProps = {
  position: ListDto["position"];
  boardId: EntityId;
};

export default function MakeNewList({ position, boardId }: MakeNewListProps) {
  const { addList } = useUnit(listApi);

  const emptyList: Parameters<typeof addList>[0] = {
    name: "",
    position,
    boardId,
  };

  function handleClick() {
    addList(emptyList);
  }

  return (
    <button className={styles.make_new_list} onClick={handleClick}>
      Make New List
    </button>
  );
}
