import { KanbanBoard } from "src/types";

export default async function updateBoard(board: KanbanBoard) {
    await new Promise((res) => setTimeout(res, 1500));
    // TODO remove this mock
    // eslint-disable-next-line no-console
    console.log('Board was updated!', board);
}