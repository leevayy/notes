import { CardDto } from "@dto/interfaces";
import { useUnit } from "effector-react";
import { cardDragged, cardRemoved } from "src/widgets/Board/model";

import { EditableText } from "../../shared/EditableText/EditableText";
import styles from "./Card.module.css";
import DeleteButton from "./DeleteButton/DeleteButton";
import { cardUpdated } from "./model";

type CardProps = {
  card: CardDto;
  onDragEnd: () => void;
};

export default function Card({ card, onDragEnd }: CardProps) {
  const updateCard = useUnit(cardUpdated);
  const setDraggedCard = useUnit(cardDragged);
  const removeCard = useUnit(cardRemoved);

  function handleChange(newText: CardDto["text"]) {
    updateCard({
      ...card,
      text: newText,
    });
  }

  return (
    <li
      className={styles.card}
      draggable={true}
      onDrag={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setDraggedCard(card);
      }}
      onDragEnd={(e) => {
        e.preventDefault();
        setDraggedCard(null);
        onDragEnd();
      }}
    >
      <DeleteButton onClick={() => removeCard(card.id)} />
      <EditableText
        shouldAutoResize={true}
        value={card.text ?? ""}
        id={String(card.id)}
        onChange={(e) => handleChange(e.target.value)}
      />
    </li>
  );
}
