import {useState} from 'react';
import { FocusableInput } from "./../utils/focusableInput";
import {KanbanList} from './../../types';
import { Card } from './card';
import { toSortedByPosition } from '../../utils/utils';

function MakeNewCardForm() {
	const [newCardText, setNewCardText] = useState('');
	const [hasFocus, setFocus] = useState(false);

	return (
		<form name='make-new-card'
			className={`make-new-card ${hasFocus ? 'has-focus' : ''}`} method='GET'>
			<FocusableInput 
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
			<input value="" className="new-card-submit" type='submit' />
		</form>);
}

type ListHeaderProps = {
	listName: string;
	setListName: (state: string) => void;
}

function ListHeader(props: ListHeaderProps) {
	const [hasFocus, setFocus] = useState(false);

	return (
		<div className="list-name-header">
			<FocusableInput
				className={`list-name ${hasFocus ? 'has-focus' : ''}`}
				type="text"
				value={props.listName}
				setFocus={setFocus}
				setInputText={props.setListName}
			/>
		</div>
	);
}

export function List({ list }: { list: KanbanList }) {
	const [listName, setListName] = useState(list.name);
	return (
		<li className="list" draggable>
			<ListHeader 
				listName={listName}
				setListName={setListName}
			/>
			<ul className="list-cards-wrapper">
				{
					toSortedByPosition(list.cards).map(card =>
						<Card card={card} key={card.id}/>)
				}
			</ul>
			<MakeNewCardForm></MakeNewCardForm>
		</li>
	);
}