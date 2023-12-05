import { FocusableTextInput } from "../utils/focusableTextInput";
import { useState } from "react";
import { KanbanCard } from "../../types";
import { getId } from "../../utils/utils";

type MakeNewCardFormProps = {
	appendCard: (card: KanbanCard) => void;
}

export function MakeNewCardForm(props: MakeNewCardFormProps) {
	const [newCardText, setNewCardText] = useState('');
	const [hasFocus, setFocus] = useState(false);

	function handleClick() {
		if (newCardText === '') {
			return;
		}

		props.appendCard(
			{
				text: newCardText,
				id: getId(),
				position: 0
			}
		);
		setNewCardText('');
	}

	return (
		<form name='make-new-card'
			className={`make-new-card ${hasFocus ? 'has-focus' : ''}`} 
			method='GET'
		>
			<FocusableTextInput 
				inputType='input'
				name="new-card-text"
				form='make-new-card'
				className="new-card-text"
				type="text"
				autoComplete="off"
				value={newCardText}
				setFocus={setFocus} 
				setInputText={setNewCardText}
			/>
			<input 
				value="" 
				className="new-card-submit" 
				type='button' 
				onClick={handleClick}
			/>
		</form>);
}