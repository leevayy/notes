import { ListDto } from "@dto/interfaces";
import { createEvent } from "effector";
import { $board } from "src/widgets/Board/model";

export const listCreated = createEvent<ListDto>();

$board.on(listCreated, (board, newList) => ({
  ...board,
  lists: [...board.lists, newList],
}));
