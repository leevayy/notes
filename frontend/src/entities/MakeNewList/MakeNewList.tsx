import { EntityId } from "@dto/interfaces";
import { useUnit } from "effector-react";
import { t } from "i18next";
import { listApi } from "src/features/List/model";

import styles from "./MakeNewList.module.css";

type MakeNewListProps = {
  boardId: EntityId;
};

export default function MakeNewList({ boardId }: MakeNewListProps) {
  const { addList } = useUnit(listApi);

  const emptyList: Parameters<typeof addList>[0] = {
    name: "",
    boardId,
  };

  function handleClick() {
    addList(emptyList);
  }

  return (
    <button className={styles.make_new_list} onClick={handleClick}>
      {t("make_new_list")}
    </button>
  );
}
