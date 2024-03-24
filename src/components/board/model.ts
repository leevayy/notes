import { createEffect, createEvent, createStore, sample } from "effector";
import { KanbanBoard, KanbanCard } from "../../types";
import fetchBoard from "../../api/fetchBoard";
import { debounce } from "patronum";
import updateBoard from "../../api/updateBoard";
import { listUpdated } from "./List/model";

const DEBOUNCE_TIMEOUT_IN_MS = 1000;

export const $board = createStore<KanbanBoard>({name: 'loading...', lists: [], id: 'loading'});

export const fetchBoardFx = createEffect(fetchBoard);

export const boardUpdated = createEvent<KanbanBoard>();

export const updateBoardFx = createEffect(updateBoard);

$board.on(boardUpdated, (_, newBoard) => {
    return newBoard;
});

export const debouncedBoardUpdated = debounce(boardUpdated, DEBOUNCE_TIMEOUT_IN_MS);

sample({
    clock: debouncedBoardUpdated,
    target: updateBoardFx
})

export const $draggedCard = createStore<KanbanCard | null>(null);

export const cardDragged = createEvent<KanbanCard | null>();

$draggedCard.on(cardDragged, (_, draggedCard) => draggedCard);

export const cardRemoved = createEvent<KanbanCard["id"]>();

sample({
    source: $board,
    clock: cardRemoved,
    fn: (board, removedCardId) => {
        const updatedListIndex = board.lists.findIndex(l => ~l.cards.findIndex(c => c.id === removedCardId));

        if (!~updatedListIndex) {
            throw new Error(`List with card id: ${removedCardId} was not found`);
        }

        const updatedList = board.lists[updatedListIndex];

        const nextList = {
			...updatedList, 
			cards: updatedList.cards.filter(c => c.id !== removedCardId)
		}

        const nextBoard = {
            ...board,
            lists: board.lists.map(list => {
                if (list.id === updatedList.id) {
                    return nextList;
                }

                return list;
            })
        }

        return nextBoard;
    },
    target: boardUpdated
})
