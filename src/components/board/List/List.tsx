import { useUnit } from "effector-react";
import { KanbanCard, KanbanList } from "../../../types";
import { EditableText } from "../../utils/EditableText/EditableText";
import styles from "./List.module.css";
import MakeNewCard from "./MakeNewCard/MakeNewCard";
import { cardInserted } from "./model";
import { $draggedCard, cardRemoved } from "../model";
import { getId } from "../../../utils/utils";

type ListProps = React.PropsWithChildren & {
	list: KanbanList;
	setDropPosition: React.Dispatch<React.SetStateAction<number>>;
};

// bad code, but i can't figure out how to calculate it on the fly
// needs to be readjasted with each design change
const CARDS_PADDING = 10;

const getCardDropPosition = (dragEvent: React.DragEvent<HTMLLIElement>) => {
	const cards = dragEvent.currentTarget.children.item(1);

	if (!cards) {
		throw new Error("Droped card to list which has no cards wrapper!");
	}

	const cardsArr = Array.from(cards.children);

	const calculateDropYWithOffset = (dropY: number, cards: Element) => {
		const cardsTopScreenOffset = cards.getBoundingClientRect().top;
		const windowScroll = window.scrollY;
		const topOffset = cardsTopScreenOffset - windowScroll;

		return dropY - topOffset
	}

	const dropY = calculateDropYWithOffset(dragEvent.clientY, cards);

	const calculateGap = (cardsArr: Element[], cardsHeight: number) => {
		if (cardsArr.length <= 1) {
			return 0;
		}
	
		const nonCardSpace = cardsArr.reduce((nonCardSpace, card) => {
			return nonCardSpace - card.clientHeight;
		}, cardsHeight);

		return (nonCardSpace - 2 * CARDS_PADDING) / (cardsArr.length - 1)
	}

	const gap = calculateGap(cardsArr, cards.clientHeight);

	let currentInsertionY = CARDS_PADDING;
	for (const [cardIndex, card] of cardsArr.entries()) {
		const nextInsertionY = currentInsertionY + card.clientHeight + (cardIndex !== 0 ? gap : 0);

		const droppedBeforeNextOffset = nextInsertionY > dropY;
		
		if (droppedBeforeNextOffset) {
			const droppedInFirstHalfOfCard = dropY > currentInsertionY + gap + card.clientHeight / 2;

			if (droppedInFirstHalfOfCard) {
				return cardIndex + 1;
			} else {
				return cardIndex;
			}
		}
		currentInsertionY = nextInsertionY;
	}

	return cardsArr.length;
};

export default function List({ children, list, setDropPosition }: ListProps) {
	const draggedCard = useUnit($draggedCard);
	const insertCard = useUnit(cardInserted);
	const removeCard = useUnit(cardRemoved);

	const unshiftCard = (newCard: KanbanCard) =>
		insertCard({
			card: newCard,
			updatedList: list,
			insertionIndex: 0,
		});

	function dragOverHandler(e: React.DragEvent<HTMLLIElement>) {
		e.preventDefault();

		if (!draggedCard) {
			throw new Error("Dragged card is null");
		}

		const cardDropPosition = getCardDropPosition(e);
		setDropPosition(cardDropPosition);
	}

	function dropHandler(e: React.DragEvent<HTMLLIElement>) {
		e.preventDefault();

		if (!draggedCard) {
			throw new Error("Dragged card is null");
		}

		const cardDropPosition = getCardDropPosition(e);

		insertCard({
			card: { ...draggedCard, id: getId(), position: cardDropPosition },
			updatedList: list,
			insertionIndex: cardDropPosition,
		});

		removeCard(draggedCard!["id"]);

		setDropPosition(0);
	}

	return (
		<li className={styles.list} onDragOver={dragOverHandler} onDrop={dropHandler}>
			<ListHeader listName={list.name} id={list.id} />
			<ul className={styles.list_cards_wrapper}>{children}</ul>
			<MakeNewCard unshiftCard={unshiftCard} />
		</li>
	);
}

type ListHeaderProps = {
	listName: string;
	id: string;
};

function ListHeader({ listName, id }: ListHeaderProps) {
	return (
		<h2 className={styles.list_name_header}>
			<EditableText
				value={listName}
				id={id}
				onChange={(e) => {
					console.log("onChange for ListHeader wasn't implemented yet");
				}}
			/>
		</h2>
	);
}
