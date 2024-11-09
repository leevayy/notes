import { createEvent } from "effector";

import { KanbanList } from "../../../types";
import { $board } from "../Board/model";

export const listCreated = createEvent<KanbanList>();

$board.on(listCreated, (board, newList) => ({
  ...board,
  lists: [...board.lists, newList],
}));
