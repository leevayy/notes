import { BoardDto, EntityId, UpdateBoardRequestDto } from "@dto/interfaces";
import { getBoard, updateBoard } from "api/generatedApi";
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { groupBy } from "lodash";
import { $cards } from "src/entities/Card/model";
import { $lists, getListModelFromDto } from "src/features/List/model";

const fetchBoard = createEvent<{ boardId: EntityId }>();

const changeBoard = createEvent<{
  boardId: EntityId;
  changes: UpdateBoardRequestDto["body"];
}>();

export const getBoardFx = createEffect(getBoard);

const updateBoardFx = createEffect(updateBoard);

type BoardModel = Omit<BoardDto, "cards"> & {
  listsOrder: EntityId[];
};

export const getBoardModelFromDto = (board: BoardDto): BoardModel => ({
  ...board,
  listsOrder: board.lists.map((list) => list.id),
});

const $board = createStore<BoardModel | null>(null);

export const $boards = combine(
  $cards,
  $lists,
  $board,
  (cards, lists, board) => {
    const listsByBoardId = groupBy(Object.values(lists), "boardId");

    const getDerivedBoards = (boardId: string): [EntityId, BoardDto] => {
      if (board && boardId === String(board.id)) {
        return [
          Number(boardId),
          {
            name: board && boardId === String(board.id) ? board.name : "",
            id: Number(boardId),
            lists: board.listsOrder.map((listId) => {
              const list = lists[listId];

              return {
                ...list,
                cards: list.cardsOrder.map((cardId) => cards[cardId]),
              };
            }),
          },
        ];
      }

      const boardLists = listsByBoardId[boardId];

      return [
        Number(boardId),
        {
          name: "",
          id: Number(boardId),
          lists: boardLists.map((list) => {
            return {
              ...list,
              cards: list.cardsOrder.map((cardId) => cards[cardId]),
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
  fn: ({ board }) => getBoardModelFromDto(board),
  target: $board,
});

sample({
  clock: getBoardFx.doneData,
  fn: ({ board }) =>
    Object.fromEntries(
      board.lists.map((list) => [list.id, getListModelFromDto(list)]),
    ),
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

sample({
  clock: changeBoard,
  fn: ({ boardId, changes }) => ({
    pathParams: { id: String(boardId) },
    body: changes,
  }),
  target: updateBoardFx,
});

sample({
  clock: updateBoardFx.doneData,
  fn: ({ board }) => getBoardModelFromDto(board),
  target: $board,
});

export const boardApi = {
  fetchBoard,
  changeBoard,
};
