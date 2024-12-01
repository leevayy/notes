import { CardDto } from "@dto/interfaces";
import { useUnit } from "effector-react";

import { EditableText } from "../../shared/EditableText/EditableText";
import styles from "./Card.module.css";
import DeleteButton from "./DeleteButton/DeleteButton";
import { cardApi } from "./model";

type CardProps = {
  card: CardDto;
  onDragEnd: () => void;
};

export default function Card({ card, onDragEnd }: CardProps) {
  const { changeCard, removeCard } = useUnit(cardApi);

  function handleChange(newText: CardDto["text"]) {
    changeCard({ cardId: card.id, changes: { text: newText ?? "" } });
  }

  return (
    <li
      className={styles.card}
      // draggable={true}
      // onDrag={(e) => {
      //   e.preventDefault();
      //   e.stopPropagation();

      // setDraggedCard(card);
      // }}
      // onDragEnd={(e) => {
      //   e.preventDefault();
      // setDraggedCard(null);
      //   onDragEnd();
      // }}
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
