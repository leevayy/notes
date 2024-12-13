import { ListDto } from "@dto/interfaces";
import { useUnit } from "effector-react";
import { useContext } from "react";
import { cardApi } from "src/features/Card/model";
import { DragAndDropContext } from "src/widgets/Board/Board";

import styles from "./List.module.css";
import ListHeader from "./ListHeader/ListHeader";
import MakeNewCard, { MakeNewCardProps } from "./MakeNewCard/MakeNewCard";

export const getTopOffset = (rect: DOMRect) => {
  const cardsTopScreenOffset = rect.top;
  const windowScroll = window.scrollY;
  const topOffset = cardsTopScreenOffset - windowScroll;

  return topOffset;
};

type ListProps = React.PropsWithChildren & {
  list: ListDto;
  dragOverHandler: React.DragEventHandler<HTMLLIElement>;
  dropHandler: React.DragEventHandler<HTMLLIElement>;
};

export default function List({
  children,
  list,
  dragOverHandler,
  dropHandler,
}: ListProps) {
  const { addCard } = useUnit(cardApi);
  const { setDraggedListId } = useContext(DragAndDropContext);

  const unshiftCard: MakeNewCardProps["unshiftCard"] = (newCard) =>
    addCard({
      text: newCard.text ?? "",
      listId: list.id,
    });

  function dragHandler(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault();
    setDraggedListId?.(list.id);
  }

  function dragEndHandler(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault();
    setDraggedListId?.(null);
  }

  return (
    <li
      className={styles.list}
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
      onDrag={dragHandler}
      onDragEnd={dragEndHandler}
      draggable={true}
    >
      <ListHeader list={list} />
      <ul className={styles.list_cards_wrapper}>{children}</ul>
      <MakeNewCard unshiftCard={unshiftCard} />
    </li>
  );
}
