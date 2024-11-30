import { BoardDto, CardDto, ListDto } from "@dto/interfaces";
import fetchBoard from "api/fetchBoard";
import updateBoard from "api/updateBoard";
import { createEffect, createEvent, createStore, sample } from "effector";
import { debounce } from "patronum";

const DEBOUNCE_TIMEOUT_IN_MS = 1000;

export const $board = createStore<BoardDto>({
  name: "loading...",
  lists: [],
  // TODO: Remove this hardcoded id
  id: 999,
});

export const fetchBoardFx = createEffect(fetchBoard);

export const boardUpdated = createEvent<BoardDto>();

export const updateBoardFx = createEffect(updateBoard);

$board.on(boardUpdated, (_, newBoard) => {
  return newBoard;
});

export const debouncedBoardUpdated = debounce(
  boardUpdated,
  DEBOUNCE_TIMEOUT_IN_MS,
);

sample({
  clock: debouncedBoardUpdated,
  target: updateBoardFx,
});

export const $draggedCard = createStore<CardDto | null>(null);

export const cardDragged = createEvent<CardDto | null>();

$draggedCard.on(cardDragged, (_, nextDraggedCard) => nextDraggedCard);

export const cardRemoved = createEvent<CardDto["id"]>();

sample({
  source: $board,
  clock: cardRemoved,
  fn: (board, removedCardId) => {
    // Find the index of the list containing the removed card
    const updatedListIndex = board.lists.findIndex(
      (list) =>
        list.cards.findIndex((card) => card.id === removedCardId) !== -1,
    );

    if (updatedListIndex === -1) {
      throw new Error(`List with card id: ${removedCardId} was not found`);
    }

    const updatedList = board.lists[updatedListIndex];

    const nextList = {
      ...updatedList,
      cards: updatedList.cards.filter((c) => c.id !== removedCardId),
    };

    const nextBoard = {
      ...board,
      lists: board.lists.map((list) => {
        if (list.id === updatedList.id) {
          return nextList;
        }

        return list;
      }),
    };

    return nextBoard;
  },
  target: boardUpdated,
});

export const $draggedList = createStore<ListDto | null>(null);

export const listDragged = createEvent<ListDto | null>();

$draggedList.on(listDragged, (_, nextDraggedList) => nextDraggedList);

export const listRemoved = createEvent<ListDto["id"]>();

sample({
  source: $board,
  clock: listRemoved,
  fn: (board, removedListId) => {
    const removedListIndex = board.lists.findIndex(
      (l) => l.id === removedListId,
    );

    if (removedListIndex === -1) {
      throw new Error(`List with id: ${removedListId} was not found`);
    }

    const nextBoard = {
      ...board,
      lists: board.lists.filter((l) => l.id !== removedListId),
    };

    return nextBoard;
  },
  target: boardUpdated,
});

export const listInserted = createEvent<{
  list: ListDto;
  insertionIndex: number;
}>();

sample({
  source: $board,
  clock: listInserted,
  fn: (board, { list, insertionIndex }) => {
    const nextBoard = {
      ...board,
      lists: [
        ...board.lists.slice(0, insertionIndex),
        list,
        ...board.lists.slice(insertionIndex),
      ],
    };

    return nextBoard;
  },
  target: boardUpdated,
});
