import { CardDto } from "@dto/interfaces";
import { useUnit } from "effector-react";
import { useContext } from "react";
import { useDrawerContext } from "src/entities/CardDrawer/CardDrawer";
import { DragAndDropContext } from "src/widgets/Board/Board";

import { EditableText } from "../../shared/EditableText/EditableText";
import styles from "./Card.module.css";
import DeleteButton from "./DeleteButton/DeleteButton";
import { cardApi } from "./model";

type CardProps = {
  card: CardDto;
};

export default function Card({ card }: CardProps) {
  const { changeCard, removeCard } = useUnit(cardApi);
  const { setDraggedCardId } = useContext(DragAndDropContext);
  const { setOpenCardId } = useDrawerContext();

  function handleChange(newText: CardDto["text"]) {
    changeCard({ cardId: card.id, changes: { text: newText ?? "" } });
  }

  return (
    <li
      className={styles.card}
      draggable={true}
      onDrag={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setDraggedCardId?.(card.id);
      }}
      onDragEnd={(e) => {
        e.preventDefault();
        setDraggedCardId?.(null);
      }}
    >
      <DeleteButton onClick={() => removeCard(card.id)} />
      <EditableText
        shouldAutoResize={true}
        value={card.text ?? ""}
        id={String(card.id)}
        onChange={(e) => handleChange(e.target.value)}
        onClick={() => setOpenCardId?.(card.id)}
        variant="body-2"
      />
    </li>
  );
}
