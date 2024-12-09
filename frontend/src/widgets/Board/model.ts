import { BoardDto, EntityId, UpdateBoardRequestDto } from "@dto/interfaces";
import { getBoard, updateBoard } from "api/generatedApi";
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { unique } from "moderndash";
import { $cards } from "src/entities/Card/model";
import {
  $lists,
  createListFx,
  deleteListFx,
  getListModelFromDto,
  ListModel,
} from "src/features/List/model";

const fetchBoard = createEvent<{ boardId: EntityId }>();

const changeBoard = createEvent<{
  boardId: EntityId;
  changes: UpdateBoardRequestDto["body"];
}>();

export const getBoardFx = createEffect(getBoard);

const updateBoardFx = createEffect(updateBoard);

export type BoardModel = Omit<BoardDto, "lists"> & {
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
    const listsByBoardId = Object.groupBy(
      Object.values(lists),
      (list) => list.boardId,
    );
    const cardsByListId = Object.groupBy(
      Object.values(cards),
      (card) => card.listId,
    );

    const boardIds = unique(
      [
        ...Object.keys(listsByBoardId).map((id) => Number(id)),
        board?.id,
      ].filter((id) => id !== undefined),
    );

    const getDerivedBoards = (boardId: EntityId): [EntityId, BoardDto] => {
      const isFetchedBoard = board && boardId === board.id;

      if (isFetchedBoard) {
        const updatedListsIds = board.listsOrder;

        const listsOrder = updatedListsIds;

        return [
          Number(boardId),
          {
            name: board.name,
            id: Number(boardId),
            lists: listsOrder.map((listId) => {
              const list: ListModel | undefined = lists[listId];

              const updatedCardsIds =
                cardsByListId[listId]?.map((card) => card.id) ?? [];

              const cardsOrder = updatedCardsIds;

              return {
                ...list,
                cards: cardsOrder.map((cardId) => cards[cardId]),
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
          lists:
            boardLists?.map((list) => {
              return {
                ...list,
                cards: list?.cardsOrder.map((cardId) => cards[cardId]) ?? [],
              };
            }) ?? [],
        },
      ];
    };

    const derivedBoards = Object.fromEntries(boardIds.map(getDerivedBoards));

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

sample({
  clock: createListFx.doneData,
  source: $board,
  fn: (board, { list }) =>
    board
      ? {
          ...board,
          listsOrder: [...board.listsOrder, list.id],
        }
      : null,
  target: $board,
});

sample({
  clock: deleteListFx.done,
  source: $board,
  fn: (
    board,
    {
      params: {
        pathParams: { id },
      },
    },
  ) =>
    board
      ? {
          ...board,
          listsOrder: board.listsOrder.filter(
            (listId) => listId !== Number(id),
          ),
        }
      : null,
  target: $board,
});

export const boardApi = {
  fetchBoard,
  changeBoard,
};
