import { useUnit } from "effector-react";
import { KanbanCard } from "../../../types";
import { EditableText } from "../../utils/EditableText/EditableText";
import styles from "./Card.module.css";
import { cardUpdated } from "./model";
import { cardDragged, cardRemoved } from "../model";

type CardProps = {
	card: KanbanCard;
	onDragEnd: () => void;
};

export default function Card({ card, onDragEnd }: CardProps) {
	const updateCard = useUnit(cardUpdated);
	const setDraggedCard = useUnit(cardDragged);
	const removeCard = useUnit(cardRemoved);

	function handleChange(newText: KanbanCard["text"]) {
		updateCard({
			...card,
			text: newText
		});
	}

	return (
		<li className={styles.card} 
			draggable
			onDrag={(e) => {
				e.preventDefault();
				setDraggedCard(card);
			}}
			onDragEnd={(e) => {
				e.preventDefault();
				setDraggedCard(null);
				onDragEnd();
			}}
		>
			<button
				className={styles.delete_button}
				onClick={() => removeCard(card.id)}
			/>
			<EditableText value={card.text} id={card.id} onChange={(e) => handleChange(e.target.value)} />
		</li>
	);
}
