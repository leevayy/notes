import { KanbanCard } from "../../../types";
import { EditableText } from "../../utils/EditableText/EditableText";
import styles from "./Card.module.css";

type CardProps = {
  card: KanbanCard;
};

export default function Card({card}: CardProps) {
  function handleChange() {
  }

  return (
    <li
      className={styles.card}
      draggable
    >
      <EditableText value={card.text} id={card.id}/>
    </li>
  );
}
