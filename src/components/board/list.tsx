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
	setListPosition: (oldPosition: number, newPositions: number) => void;
}

export function List(props: ListProps) {
	function appendCard(card: KanbanCard) {
		props.setCards([card, ...props.list.cards]);
	}
	
	const [listName, setListName] = useState(props.list.name);
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
		if (props.currentList === null) {
			throw new Error("props.currentList is null then onDrop event is handled");
		}
		props.setListPosition(props.currentList.position, list.position);
	}

	return (
		<li className={`list ${props.currentList?.id === props.list.id ? 'current-list' : ''}`} 
			draggable
			onDragStart={e => dragStartHandler(e, props.list)}
			onDragLeave={e => dragLeaveHandler(e)}
			onDragEnd={e => dragEndHandler(e)}
			onDragOver={e => dragOverHandler(e)}
			onDrop={e => dropHandler(e, props.list)}
		>
			<ListHeader listName={listName} setListName={setListName} />
			<ul className="list-cards-wrapper">
				{toSortedByPosition(props.list.cards).map((card) => (
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