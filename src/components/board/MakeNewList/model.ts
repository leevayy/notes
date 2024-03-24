import { createEvent } from "effector";
import { $board } from "../model";
import { KanbanList } from "../../../types";

export const listCreated = createEvent<KanbanList>();

$board.on(listCreated, (board, newList) => ({
    ...board,
    lists: [...board.lists, newList]
}))
