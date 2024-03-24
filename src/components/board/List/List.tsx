import { useUnit } from "effector-react";
import { KanbanCard, KanbanList } from "../../../types";
import { EditableText } from "../../utils/EditableText/EditableText";
import styles from "./List.module.css";
import MakeNewCard from "./MakeNewCard/MakeNewCard";
import { cardInserted, listNameChanged } from "./model";
import { $draggedCard, cardRemoved } from "../model";
import { getId } from "../../../utils/utils";
import { Position } from "../../../App";

type ListProps = React.PropsWithChildren & {
	list: KanbanList;
	setDropPosition: React.Dispatch<React.SetStateAction<Position>>;
	resetDropPosition: () => void;
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
	const cardsRect = cards.getBoundingClientRect();
	const cardsHeight = cardsRect.height;

	const getTopOffset = (cardsRect: DOMRect) => {
		const cardsTopScreenOffset = cardsRect.top;
		const windowScroll = window.scrollY;
		const topOffset = cardsTopScreenOffset - windowScroll;

		return topOffset;
	}

	const topOffset = getTopOffset(cardsRect);

	const calculateDropYWithoutOffset = (dropY: number, topOffset: number) => {
		return dropY - topOffset;
	}

	const dropY = calculateDropYWithoutOffset(dragEvent.clientY, topOffset);

	const calculateGap = (cardsArr: Element[], cardsHeight: number) => {
		if (cardsArr.length <= 1) {
			return 0;
		}
	
		const nonCardSpace = cardsArr.reduce((nonCardSpace, card) => {
			return nonCardSpace - card.clientHeight;
		}, cardsHeight);

		return (nonCardSpace - 2 * CARDS_PADDING) / (cardsArr.length - 1)
	}

	const gap = calculateGap(cardsArr, cardsHeight);

	let currentInsertionY = CARDS_PADDING;
	for (const [cardIndex, card] of cardsArr.entries()) {
		const nextInsertionY = currentInsertionY + card.clientHeight + (cardIndex !== 0 ? gap : 0);

		const droppedBeforeNextOffset = nextInsertionY > dropY;

		if (droppedBeforeNextOffset) {
			const droppedInFirstHalfOfCard = dropY > currentInsertionY + gap + card.clientHeight / 2;

			if (droppedInFirstHalfOfCard) {
				return {
					position: cardIndex + 1,
					insertionY: currentInsertionY + topOffset,
					insertionX: cardsRect.x + CARDS_PADDING
				}
			} else {
				return {
					position: cardIndex,
					insertionY: currentInsertionY + topOffset,
					insertionX: cardsRect.x + CARDS_PADDING
				}
			}
		}
		currentInsertionY = nextInsertionY;
	}

	return {
		position: cardsArr.length,
		insertionY: currentInsertionY + topOffset,
		insertionX: cardsRect.x + CARDS_PADDING
	}
};

export default function List({ children, list, setDropPosition, resetDropPosition }: ListProps) {
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

		const {insertionX: x, insertionY: y} = getCardDropPosition(e);
		
		setDropPosition({x, y});
	}

	function dropHandler(e: React.DragEvent<HTMLLIElement>) {
		e.preventDefault();

		if (!draggedCard) {
			throw new Error("Dragged card is null");
		}

		const {position: cardDropPosition} = getCardDropPosition(e);

		insertCard({
			card: { ...draggedCard, id: getId(), position: cardDropPosition },
			updatedList: list,
			insertionIndex: cardDropPosition,
		});

		removeCard(draggedCard!["id"]);
		resetDropPosition();
	}

	return (
		<li className={styles.list} onDragOver={dragOverHandler} onDrop={dropHandler}>
			<ListHeader list={list} />
			<ul className={styles.list_cards_wrapper}>{children}</ul>
			<MakeNewCard unshiftCard={unshiftCard} />
		</li>
	);
}

const BIG_FONT_SIZE = 20;

type ListHeaderProps = {
	list: KanbanList;
};

function ListHeader({ list }: ListHeaderProps) {
	const changeListName = useUnit(listNameChanged);

	const decreasingFontSize = (name: KanbanList["name"]) => {
		const MAXIMUM_OK_HEADER_LENGTH = 12;
		const headerIsSmall = name.length < MAXIMUM_OK_HEADER_LENGTH;
		
		if (headerIsSmall) {
			return `${BIG_FONT_SIZE}pt`;
		}

		const decreaseFunction = (x: number) => 2 * Math.sqrt(x);

		return `${BIG_FONT_SIZE - decreaseFunction(name.length - MAXIMUM_OK_HEADER_LENGTH)}pt`
	}

	function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const nextName = e.target.value.replace(/\n/g, '&nbsp');
		if (nextName.length > 16) {
			return;
		}

		changeListName({nextName: nextName, updatedList: list})
	}

	return (
		<h2 
			className={styles.list_name_header}
			style={{
				fontSize: decreasingFontSize(list.name),
			}}		
		>
			<EditableText
				value={list.name}
				id={list.id + 'e'}
				onChange={handleChange}
			/>
		</h2>
	);
}
