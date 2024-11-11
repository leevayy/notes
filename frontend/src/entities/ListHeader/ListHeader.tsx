import { useUnit } from "effector-react";
import { useEffect } from "react";
import { listNameChanged } from "src/features/List/model";
import { EditableText } from "src/shared/EditableText/EditableText";
import { editableTextClicked } from "src/shared/EditableText/model";
import { listRemoved } from "src/widgets/Board/model";

import { KanbanList } from "../../types";
import DeleteButton from "../Card/DeleteButton/DeleteButton";
import styles from "./ListHeader.module.css";

const BIG_FONT_SIZE = 20;

type ListHeaderProps = {
  list: KanbanList;
};

export default function ListHeader({ list }: ListHeaderProps) {
  const changeListName = useUnit(listNameChanged);
  const clickEditableText = useUnit(editableTextClicked);
  const removeList = useUnit(listRemoved);

  useEffect(() => {
    const shouldFocus = list.name === "";

    if (!shouldFocus) {
      return;
    }

    clickEditableText(list.id);
  }, [clickEditableText, list.id, list.name]);

  const decreasingFontSize = (name: KanbanList["name"]) => {
    const MAXIMUM_OK_HEADER_LENGTH = 8;
    const headerIsSmall = name.length < MAXIMUM_OK_HEADER_LENGTH;

    if (headerIsSmall) {
      return `${BIG_FONT_SIZE}pt`;
    }

    const decreaseFunction = (x: number) => 2.5 * Math.sqrt(x);

    return `${BIG_FONT_SIZE - decreaseFunction(name.length - MAXIMUM_OK_HEADER_LENGTH)}pt`;
  };

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const nextName = e.target.value.replace(/\n/g, " ");

    if (nextName.length > 16) {
      return;
    }

    changeListName({ nextName, updatedList: list });
  }

  return (
    <h2
      className={styles.list_name_header}
      style={{
        fontSize: decreasingFontSize(list.name),
      }}
    >
      <DeleteButton onClick={() => removeList(list.id)} />
      <EditableText
        alignCenter={true}
        shouldAutoResize={false}
        value={list.name}
        id={list.id}
        onChange={handleChange}
      />
    </h2>
  );
}
