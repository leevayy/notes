import { useUnit } from "effector-react";
import { KanbanCard, KanbanList } from "../../../types";
import { EditableText } from "../../utils/EditableText/EditableText";
import styles from "./List.module.css";
import MakeNewCard from "./MakeNewCard/MakeNewCard";
import { cardInserted } from "./model";
import {$draggedCard, cardRemoved } from "../model";
import { getId } from "../../../utils/utils";

type ListProps = React.PropsWithChildren & {
	list: KanbanList;
	setDropPosition: React.Dispatch<React.SetStateAction<number>>
};


// bad code, but i can't figure out how to calculate it on the fly
// needs to be readjasted with each design change
const CARDS_PADDING = 10;

/**
 * returns card position which is number from 1
 * @param dropY 
 * @returns 
 */
const getCardDropPosition = (dragEvent: React.DragEvent<HTMLLIElement>) => {
	const cards = dragEvent.currentTarget.children.item(1);

	if (!cards) {
		throw new Error("Droped card to list which has no cards!");
	}

	const cardsArr = Array.from(cards.children);

	const cardsTopScreenOffset = cards.getBoundingClientRect().top;
	const windowScroll = window.scrollY;
	const topOffset = cardsTopScreenOffset - windowScroll;
	
	const dropY = dragEvent.clientY - topOffset;

	const cardsHeight = cards.clientHeight;

	const nonCardSpace = cardsArr.reduce((nonCardSpace, card) => {
		return nonCardSpace - card.clientHeight;
	}, cardsHeight);

	const gap = cardsArr.length > 1 ? (nonCardSpace - 2 * CARDS_PADDING) / (cardsArr.length - 1) : 0;
	
	let offsetY = CARDS_PADDING;
	for (const [cardIndex, card] of cardsArr.entries()) {
		const nextOffset = offsetY + card.clientHeight +
			(cardIndex !== 0 ? gap : 0);

		const droppedBeforeNextOffset = nextOffset > dropY;
		if (droppedBeforeNextOffset) {
			const droppedInFirstHalfOfCard = dropY > offsetY + gap + card.clientHeight / 2;

			if (droppedInFirstHalfOfCard) {
				return cardIndex + 1;
			} else {
				return cardIndex;
			}
		}
		offsetY = nextOffset;
	}

	return cardsArr.length;
}

export default function List({ children, list, setDropPosition }: ListProps) {
	const draggedCard = useUnit($draggedCard);
	const insertCard = useUnit(cardInserted);
	const removeCard = useUnit(cardRemoved);

	const unshiftCard = (newCard: KanbanCard) => insertCard({
		card: newCard, 
		updatedList: list, 
		insertionIndex: 0
	});

	function dragOverHandler(e: React.DragEvent<HTMLLIElement>) {
		e.preventDefault();

		if (!draggedCard) {
			throw new Error('Dragged card is null');
		}

		const cardDropPosition = getCardDropPosition(e);
		setDropPosition(cardDropPosition);
	}

	function dropHandler(e: React.DragEvent<HTMLLIElement>) {
		e.preventDefault();

		if (!draggedCard) {
			throw new Error('Dragged card is null');
		}

		const cardDropPosition = getCardDropPosition(e);

		insertCard({
			card: {...draggedCard, id: getId(), position: cardDropPosition}, 
			updatedList: list,
			insertionIndex: cardDropPosition
		});

		removeCard(draggedCard!["id"]);

		setDropPosition(0);
	}

	return (
		<li className={styles.list}
			onDragOver={dragOverHandler}
			onDrop={dropHandler}
		>
			<ListHeader
				listName={list.name}
				id={list.id}
			/>
			<ul className={styles.list_cards_wrapper}>{children}</ul>
			<MakeNewCard unshiftCard={unshiftCard}/>
		</li>
	);
}

type ListHeaderProps = {
	listName: string;
	id: string;
};
  
function ListHeader({listName, id}: ListHeaderProps) {
	return <h2 className={styles.list_name_header}>
		<EditableText 
			value={listName}
			id={id}
			onChange={(e) => {console.log("onChange for ListHeader wasn't implemented yet")}}
		/>
	</h2>
}