import { createEvent, sample } from "effector";

import { KanbanCard, KanbanList } from "../../../types";
import { $board, boardUpdated } from "../Board/model";

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
      }),
    };

    return nextBoard;
  },
  target: boardUpdated,
});

export const cardInserted = createEvent<{
  card: KanbanCard;
  updatedList: KanbanList;
  insertionIndex: number;
}>();

sample({
  source: $board,
  clock: cardInserted,
  fn: (_, { card, updatedList, insertionIndex }) => {
    const nextList = {
      ...updatedList,
      cards: [
        ...updatedList.cards.slice(0, insertionIndex),
        card,
        ...updatedList.cards.slice(insertionIndex),
      ],
    };

    return nextList;
  },
  target: listUpdated,
});

export const listNameChanged = createEvent<{
  nextName: KanbanList["name"];
  updatedList: KanbanList;
}>();

sample({
  source: $board,
  clock: listNameChanged,
  fn: (_, { nextName, updatedList }) => {
    const nextList = {
      ...updatedList,
      name: nextName,
    };

    return nextList;
  },
  target: listUpdated,
});
