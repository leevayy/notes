import { TextInput } from "../utils/textInput";
import { useState } from "react";
import { KanbanCard } from "../../types";
import { getId } from "../../utils/utils";

type MakeNewCardFormProps = {
	appendCard: (card: KanbanCard) => void;
}

export function MakeNewCardForm(props: MakeNewCardFormProps) {
	const [newCardText, setNewCardText] = useState('');

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
			className={`make-new-card`} 
			method='GET'
		>
			<TextInput 
				inputType='input'
				name="new-card-text"
				form='make-new-card'
				className="new-card-text"
				type="text"
				autoComplete="off"
				value={newCardText}
				setInputText={setNewCardText}
				onKeyDown={({key}) => {
					if (key === 'Enter') {
						handleClick()
					}
				}}
			/>
			<input 
				value="" 
				className="new-card-submit" 
				type='button' 
				onClick={handleClick}
			/>
		</form>);
}