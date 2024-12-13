import { Position } from "src/types";

import styles from "./DropDummy.module.css";

type DropDummyProps = {
  dropPosition: Position;
};

export default function DropDummyList({ dropPosition }: DropDummyProps) {
  return (
    <div
      className={`${styles.dummy} ${styles.vertical}`}
      onDragOver={(e) => e.preventDefault()}
      style={{
        top: `${dropPosition.y}px`,
        left: `${dropPosition.x}px`,
      }}
    />
  );
}
