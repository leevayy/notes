import styles from "./Board.module.css";
import { Position } from "../../../App";
import { $draggedCard, $draggedList, boardUpdated, listDragged, listInserted, listRemoved } from "./model";
import { useUnit } from "effector-react";
import { PropsWithChildren } from "react";
import { KanbanBoard } from "../../../types";
import { getTopOffset } from "../List/List";
import { getId } from "../../../utils/utils";

// code, as bad as in handling card drop on the lise
// i still cannot figure out how to calculate padding on the fly
// needs to be readjasted with each design change
const BOARD_PADDING = 30;
const LISTS_GAP = 36;

const getListDropPosition = (dragEvent: React.DragEvent<HTMLUListElement>) => {
	const lists = dragEvent.currentTarget;

	const listsRect = lists.getBoundingClientRect();
	const listsArr = Array.from(lists.children);
	const listsWidth = listsRect.width;

	const topOffset = getTopOffset(listsRect);

	const gap = LISTS_GAP;
	
	const dropX = dragEvent.clientX;

	let currentInsertionX = BOARD_PADDING;
	for (const [listIndex, list] of listsArr.slice(0, listsArr.length - 1).entries()) {
		const nextInsertionX = currentInsertionX + list.clientWidth + (listIndex !== 0 ? gap : 0);

		const droppedBeforeNextOffset = nextInsertionX > dropX;

		if (droppedBeforeNextOffset) {
			const droppedInFirstHalfOfList =
				dropX < currentInsertionX + gap + list.clientWidth / 2;
			
			console.log(currentInsertionX + gap + list.clientWidth / 2, dropX);

			if (droppedInFirstHalfOfList) {
				return {
					position: listIndex,
					insertionX: currentInsertionX + gap / 2 - 6,
					insertionY: BOARD_PADDING + topOffset,
				};
			} else {
				return {
					position: listIndex + 1,
					insertionX: nextInsertionX + gap / 2 - 6,
					insertionY: BOARD_PADDING + topOffset,
				}
			}
		}
		currentInsertionX = nextInsertionX;
	}

	return {
		position: listsArr.length,
		insertionX: currentInsertionX + gap / 2 - 6,
		insertionY: BOARD_PADDING + topOffset,
	}
}

type BoardProps = PropsWithChildren & {
	board: KanbanBoard;
	setListDropPosition: React.Dispatch<React.SetStateAction<Position>>;
	resetListDropPosition: () => void;
};

export function Board({ children, setListDropPosition, resetListDropPosition }: BoardProps) {
	const [draggedList, setDraggedList] = useUnit([$draggedList, listDragged]);
	const draggedCard = useUnit($draggedCard);

	const insertList = useUnit(listInserted);
	const removeList = useUnit(listRemoved);

	const dragEventIsAboutList = draggedList && !draggedCard;

	function dragOverHandler(e: React.DragEvent<HTMLUListElement>) {
		e.preventDefault();

		if (!dragEventIsAboutList) {
			return;
		}

		const { insertionX: x, insertionY: y } = getListDropPosition(e);

		setListDropPosition({ x, y });
	}

	function dropHandler(e: React.DragEvent<HTMLUListElement>) {
		e.preventDefault();

		if (!dragEventIsAboutList) {
			return;
		} 

		const { position: listDropPosition } = getListDropPosition(e);

		insertList({
			list: {
				...draggedList,
				id: getId(),
				position: listDropPosition,
			},
			insertionIndex: listDropPosition,
		});

		removeList(draggedList["id"]);
		resetListDropPosition();
		setDraggedList(null);
	}

	return (
		<>
			<ul
				className={styles.board}
				onDragOver={dragOverHandler}
				onDrop={dropHandler}
			>
				{children}
			</ul>
		</>
	);
}
