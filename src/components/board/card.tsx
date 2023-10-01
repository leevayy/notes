import { KanbanCard } from "../../types";
import { useState } from "react";
import { FocusableTextInput } from "../utils/focusableTextInput";

export function Card({ card }: { card: KanbanCard }) {
	const [cardText, setCardText] = useState(card.text)
	const [hasFocus, setFocus] = useState(false);

	return (
		<li 
			className={`card ${hasFocus ? 'has-focus' : ''}`}
			draggable
			onMouseDown={(e) => {
				e.stopPropagation();
				console.log(e.target);
			}}
		>
			<FocusableTextInput
				inputType='input-like'
				className='card-text'
				value={cardText}
				setFocus={setFocus}
				setInputText={setCardText}
			/>
		</li>);
}