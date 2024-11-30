import { BoardDto } from "@dto/interfaces";

export default async function updateBoard(board: BoardDto) {
    await fetch('/api/board/update', {
        method: 'POST',
        body: JSON.stringify(board),
    });
}
