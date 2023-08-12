import { KanbanCard } from "../../types";
import { useState } from "react";
import { FocusableInput } from "../utils/focusableInput";

export function Card({ card }: { card: KanbanCard }) {
	const [cardText, setCardText] = useState(card.text)
	const [hasFocus, setFocus] = useState(false);

	return (
		<li className={`card ${hasFocus ? 'has-focus' : ''}`} draggable>
			<FocusableInput
				className='card-text'
				value={cardText}
				setFocus={setFocus}
				setInputText={setCardText}
			/>
		</li>);
}