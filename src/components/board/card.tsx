import { KanbanCard } from "../../types";
import { DragEvent, useState } from "react";
import { TextInput } from "../utils/textInput";

type CardProps = {
  card: KanbanCard;
  currentCard: KanbanCard | null;
  setCurrentCard: (list: KanbanCard | null) => void;
  setCardPosition: (oldPosition: number, newPositions: number) => void;
};

export function Card(props: CardProps) {
  const [cardText, setCardText] = useState(props.card.text);

  function dragStartHandler(e: DragEvent<HTMLLIElement>, card: KanbanCard) {
    props.setCurrentCard(card);
  }

  function dragEndHandler(e: DragEvent<HTMLLIElement>) {
    props.setCurrentCard(null);
  }

  function dragOverHandler(e: DragEvent<HTMLLIElement>) {
    e.preventDefault();
  }

  function dropHandler(e: DragEvent<HTMLLIElement>, card: KanbanCard) {
    e.preventDefault();
    if (props.currentCard === null) {
      throw new Error("props.currentCard is null then onDrop event is handled");
    }
	
    props.setCardPosition(props.currentCard.position, card.position);
  }

  return (
    <li
      className={`card`}
      draggable
      onDragStart={(e) => dragStartHandler(e, props.card)}
      onDragEnd={(e) => dragEndHandler(e)}
      onDragOver={(e) => dragOverHandler(e)}
      onDrop={(e) => dropHandler(e, props.card)}
    >
      <TextInput
        inputType="input-like"
        className="card-text"
        value={cardText}
        setInputText={setCardText}
      />
    </li>
  );
}
