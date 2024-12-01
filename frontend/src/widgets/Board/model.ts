import { BoardDto, EntityId } from "@dto/interfaces";
import { getBoard } from "api/generatedApi";
import { createEffect, createEvent, createStore, sample } from "effector";
import { $cards } from "src/entities/Card/model";
import { $lists, createListFx, listApi } from "src/features/List/model";

const fetchBoard = createEvent<{ boardId: EntityId }>();

export const getBoardFx = createEffect(getBoard);

sample({
  clock: fetchBoard,
  fn: ({ boardId }) => ({ pathParams: { id: String(boardId) } }),
  target: getBoardFx,
});

export const $boards = createStore<Record<EntityId, BoardDto>>({});

$boards.on(getBoardFx.doneData, (state, { board }) => ({
  ...state,
  [board.id]: board,
}));

$boards.on(createListFx.doneData, (state, { list }) => {
  const board = state[list.boardId];

  return {
    ...state,
    [board.id]: {
      ...board,
      lists: [...board.lists, list],
    },
  };
});

sample({
  clock: getBoardFx.doneData,
  fn: ({ board }) =>
    Object.fromEntries(board.lists.map((list) => [list.id, list])),
  target: $lists,
});

sample({
  clock: getBoardFx.doneData,
  fn: ({ board }) =>
    Object.fromEntries(
      board.lists.flatMap((list) => list.cards.map((card) => [card.id, card])),
    ),
  target: $cards,
});

export const boardApi = {
  fetchBoard,
};
