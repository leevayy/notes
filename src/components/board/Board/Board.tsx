import { PropsWithChildren } from "react";
import { KanbanBoard } from "../../../types";
import styles from "./Board.module.css"

type BoardProps = PropsWithChildren & {
    board: KanbanBoard
}  

export function Board({ children }: BoardProps) {
  return (
      <ul className={styles.board}>
        {
            children
        }
      </ul>
  );
}
