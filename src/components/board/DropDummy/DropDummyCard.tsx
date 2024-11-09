import { Position } from "../../../App";
import styles from "./DropDummy.module.css";

type DropDummyProps = {
  dropPosition: Position;
};

export default function DropDummyCard({ dropPosition }: DropDummyProps) {
  return (
    <div
      className={styles.dummy}
      onDragOver={(e) => e.preventDefault()}
      style={{
        top: `${dropPosition.y + 5}px`,
        left: `${dropPosition.x}px`,
      }}
    />
  );
}
