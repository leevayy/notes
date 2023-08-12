import { FocusableTextInput } from "../utils/focusableTextInput";
import { useState } from "react";

export function MakeNewCardForm() {
	const [newCardText, setNewCardText] = useState('');
	const [hasFocus, setFocus] = useState(false);

	function handleClick() {
		alert(newCardText);
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
				placeholder="Make new card"
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