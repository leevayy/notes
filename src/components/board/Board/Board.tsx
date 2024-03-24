import { PropsWithChildren } from "react";
import { KanbanBoard } from "../../../types";

type BoardProps = PropsWithChildren & {
    board: KanbanBoard
}  

export function Board({ children, board }: BoardProps) {
  return (
      <ul className="board">
        {
            children
        }
      </ul>
  );
}
