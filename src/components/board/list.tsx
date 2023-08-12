import { useState } from "react";
import { FocusableTextInput } from "../utils/focusableTextInput";
import { KanbanCard, KanbanList } from "./../../types";
import { Card } from "./card";
import { toSortedByPosition } from "../../utils/utils";
import { MakeNewCardForm } from "./makeNewCardForm";

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

type ListProps = {
	list: KanbanList;
	setCards: (state: KanbanCard[]) => void;
}

export function List(props: ListProps) {
	const list = props.list;

	function appendCard(card: KanbanCard) {
		props.setCards([card, ...list.cards])
	}
	
	const [listName, setListName] = useState(list.name);
	return (
		<li className="list" draggable>
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
