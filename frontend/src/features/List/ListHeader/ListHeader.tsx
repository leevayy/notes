import { EntityId, ListDto } from "@dto/interfaces";
import { useUnit } from "effector-react";
import { debounce } from "moderndash";
import { useCallback, useEffect, useState } from "react";
import { EditableText } from "src/shared/EditableText/EditableText";
import { editableTextClicked } from "src/shared/EditableText/model";

import DeleteButton from "../../Card/DeleteButton/DeleteButton";
import { listApi } from "../model";
import styles from "./ListHeader.module.css";

const BIG_FONT_SIZE = 20;

type ListHeaderProps = {
  list: ListDto;
};

export default function ListHeader({ list }: ListHeaderProps) {
  const [listName, setListName] = useState(list.name);
  const clickEditableText = useUnit(editableTextClicked);
  const { changeList, removeList } = useUnit(listApi);

  const changeListName = (listId: EntityId, nextName: string) => {
    changeList({ listId, changes: { name: nextName } });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeListName = useCallback(
    debounce(changeListName, 1000),
    [],
  );

  useEffect(() => {
    const shouldFocus = listName === "";

    if (!shouldFocus) {
      return;
    }

    clickEditableText(String(list.id));
  }, [clickEditableText, list.id, listName]);

  const decreasingFontSize = (name: string) => {
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

    setListName(nextName);

    debouncedChangeListName(list.id, nextName);
  }

  return (
    <h2
      className={styles.list_name_header}
      style={{
        fontSize: decreasingFontSize(listName ?? ""),
      }}
    >
      <DeleteButton onClick={() => removeList(list.id)} />
      <EditableText
        alignCenter={true}
        shouldAutoResize={false}
        value={listName ?? ""}
        id={String(list.id)}
        onChange={handleChange}
        variant="header-2"
      />
    </h2>
  );
}
