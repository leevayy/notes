import { DragEvent, useState } from "react";
import { TextInput } from "../utils/textInput";
import { KanbanCard, KanbanList } from "./../../types";
import { Card } from "./card";
import { toSortedByPosition } from "../../utils/utils";
import { MakeNewCardForm } from "./makeNewCardForm";
import { cookSetHasPositionPosition } from "./utils";

type ListProps = {
  list: KanbanList;
  setCards: (state: KanbanCard[]) => void;
  currentList: KanbanList | null;
  setCurrentList: (list: KanbanList | null) => void;
  setListPosition: (oldPosition: number, newPositions: number) => void;
};

export function List(props: ListProps) {
  const [listName, setListName] = useState(props.list.name);
  const [cards, setCards] = useState(props.list.cards);
  const [currentCard, setCurrentCard] = useState<KanbanCard | null>(null);

  function appendCard(card: KanbanCard) {
    props.setCards([card, ...props.list.cards]);
  }

  function dragStartHandler(e: DragEvent<HTMLLIElement>, list: KanbanList) {
    props.setCurrentList(list);
  }

  function dragEndHandler(e: DragEvent<HTMLLIElement>) {
    props.setCurrentList(null);
  }

  function dragOverHandler(e: DragEvent<HTMLLIElement>) {
    e.preventDefault();
  }

  function dropHandler(e: DragEvent<HTMLLIElement>, list: KanbanList) {
    e.preventDefault();
    if (props.currentList === null) {
      throw new Error("props.currentList is null then onDrop event is handled");
    }
    props.setListPosition(props.currentList.position, list.position);
  }

  return (
    <li
      className={`list ${
        props.currentList?.id === props.list.id ? "current-list" : ""
      }`}
      draggable
      onDragStart={(e) => dragStartHandler(e, props.list)}
      onDragEnd={(e) => dragEndHandler(e)}
      onDragOver={(e) => dragOverHandler(e)}
      onDrop={(e) => dropHandler(e, props.list)}
    >
      <ListHeader listName={listName} setListName={setListName} />
      <ul className="list-cards-wrapper">
        {toSortedByPosition(props.list.cards).map((card) => (
          <Card
            card={card}
            key={card.id}
            setCardPosition={cookSetHasPositionPosition(cards, setCards)}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
          />
        ))}
      </ul>
      <MakeNewCardForm appendCard={appendCard}></MakeNewCardForm>
    </li>
  );
}


