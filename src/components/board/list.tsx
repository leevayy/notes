import { DragEvent, useState } from "react";
import { FocusableTextInput } from "../utils/focusableTextInput";
import { KanbanCard, KanbanList } from "./../../types";
import { Card } from "./card";
import { toSortedByPosition } from "../../utils/utils";
import { MakeNewCardForm } from "./makeNewCardForm";	

type ListProps = {
	list: KanbanList;
	setCards: (state: KanbanCard[]) => void;
	currentList: KanbanList | null;
	setCurrentList: (list: KanbanList | null) => void;
	setListPosition: (postition: number) => void;
}

export function List(props: ListProps) {
	const list = props.list;

	function appendCard(card: KanbanCard) {
		props.setCards([card, ...list.cards]);
	}
	
	const [listName, setListName] = useState(list.name);
	function dragStartHandler(e: DragEvent<HTMLLIElement>, list: KanbanList) {
		props.setCurrentList(list);
	}

	function dragLeaveHandler(e: DragEvent<HTMLLIElement>) {
	}

	function dragEndHandler(e: DragEvent<HTMLLIElement>) {
		props.setCurrentList(null);
	}

	function dragOverHandler(e: DragEvent<HTMLLIElement>) {
		e.preventDefault();
	}

	function dropHandler(e: DragEvent<HTMLLIElement>, list: KanbanList) {
		e.preventDefault();
		props.setListPosition(list.position);
	}

	return (
		<li className={`list ${props.currentList?.id === list.id ? 'current-list' : ''}`} 
			draggable
			onDragStart={e => dragStartHandler(e, list)}
			onDragLeave={e => dragLeaveHandler(e)}
			onDragEnd={e => dragEndHandler(e)}
			onDragOver={e => dragOverHandler(e)}
			onDrop={e => dropHandler(e, list)}
		>
			<ListHeader listName={listName} setListName={setListName} />
			<ul className="list-cards-wrapper">
				{toSortedByPosition(list.cards).map((card) => (
					<Card card={card} key={card.id} />
				))}
			</ul>
			<MakeNewCardForm appendCard={appendCard}></MakeNewCardForm>
		</li>
	);
}

type ListHeaderProps = {
	listName: string;
	setListName: (state: string) => void;
};

function ListHeader(props: ListHeaderProps) {
	const [hasFocus, setFocus] = useState(false);

	return (
		<div className="list-name-header">
			<FocusableTextInput
				inputType="input-like"
				className={`list-name ${hasFocus ? "has-focus" : ""}`}
				type="text"
				value={props.listName}
				setFocus={setFocus}
				setInputText={props.setListName}
			/>
		</div>
	);
}