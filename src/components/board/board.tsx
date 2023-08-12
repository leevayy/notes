import { useState } from "react";
import { KanbanList, KanbanBoard, KanbanCard } from "./../../types";
import { toSortedByPosition, getId } from "../../utils/utils";
import { List } from "./list";

type MakeNewListsProps = {
	lists: KanbanList[];
	setLists: (state: KanbanList[]) => void;
};

function MakeNewList(props: MakeNewListsProps) {
	const emptyList: KanbanList = {
		name: "",
		position: props.lists.length + 1,
		cards: [],
		id: getId()
	};

	function handleClick() {
		props.setLists([...props.lists, emptyList]);
	}

	return (
		<button className="make-new-list" onClick={handleClick}>
			Make New List
		</button>
	);
}

export function Board({ board }: { board: KanbanBoard }) {
	const [lists, setLists] = useState(board.lists);

	/**
	 * Returns a function which can set state of list with specified ID
	 */
	function setCards(listId: KanbanList["id"]) {
		return function setter(cards: KanbanCard[]) {
			setLists(
				[...lists].map((list) => {
					if (list.id === listId) {
						list.cards = cards;
					}
					return list;
				})
			);
		};
	}

	return (
		<div className="board">
			<ul className="board-section">
				{toSortedByPosition(lists).map((list) => (
					<List list={list} setCards={setCards(list.id)} key={list.id} />
				))}
				<MakeNewList lists={lists} setLists={setLists} />
			</ul>
		</div>
	);
}
