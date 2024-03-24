import { KanbanBoard } from "../types";

export default async function updateBoard(board: KanbanBoard) {
    await new Promise((res, rej) => setTimeout(res, 1500));
    console.log('Board was updated!', board);
}