import { createEvent, sample } from "effector";
import { $board, boardUpdated } from "../model";
import { KanbanCard, KanbanList } from "../../../types";

export const listUpdated = createEvent<KanbanList>();

sample({
    source: $board,
    clock: listUpdated,
    fn: (board, updatedList) => {
        const nextBoard = {
            ...board,
            lists: board.lists.map((list) => {
                if (list.id === updatedList.id) {
                    return updatedList;
                }

                return list;
            })
        };

        return nextBoard;
    },
    target: boardUpdated
})

export const cardInserted = createEvent<{card: KanbanCard, updatedList: KanbanList, insertionIndex: number}>();

sample({
    source: $board,
    clock: cardInserted,
    fn: (_, {card, updatedList, insertionIndex}) => {
        const nextList = {
			...updatedList, 
			cards: [
				...updatedList.cards.slice(0, insertionIndex),
				card,
				...updatedList.cards.slice(insertionIndex) 
			]
		}

        return nextList;
    },
    target: listUpdated
})
