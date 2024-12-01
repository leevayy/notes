import { BoardDto, EntityId } from "@dto/interfaces";
import { getBoard } from "api/generatedApi";
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { groupBy } from "lodash";
import { $cards } from "src/entities/Card/model";
import { $lists } from "src/features/List/model";

const fetchBoard = createEvent<{ boardId: EntityId }>();

export const getBoardFx = createEffect(getBoard);

const $board = createStore<BoardDto | null>(null);

export const $boards = combine(
  $cards,
  $lists,
  $board,
  (cards, lists, board) => {
    const cardsByListId = groupBy(Object.values(cards), "listId");
    const listsByBoardId = groupBy(Object.values(lists), "boardId");

    const getDerivedBoards = (boardId: string): [EntityId, BoardDto] => {
      const boardLists = listsByBoardId[boardId];

      return [
        Number(boardId),
        {
          name: board && boardId === String(board.id) ? board.name : "",
          id: Number(boardId),
          lists: boardLists.map((list) => {
            return {
              ...list,
              cards: cardsByListId[list.id] ?? [],
            };
          }),
        },
      ];
    };

    const derivedBoards = Object.fromEntries(
      Object.keys(listsByBoardId).map(getDerivedBoards),
    );

    return derivedBoards;
  },
);

sample({
  clock: fetchBoard,
  fn: ({ boardId }) => ({ pathParams: { id: String(boardId) } }),
  target: getBoardFx,
});

sample({
  clock: getBoardFx.doneData,
  fn: ({ board }) => board,
  target: $board,
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
