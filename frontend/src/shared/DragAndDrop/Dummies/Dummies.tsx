import { useContext } from "react";
import { createPortal } from "react-dom";
import DropDummyCard from "src/shared/DragAndDrop/Dummies/DropDummyCard";
import DropDummyList from "src/shared/DragAndDrop/Dummies/DropDummyList";
import { DragAndDropContext } from "src/widgets/Board/Board";

export const DEFAULT_DROP_POSITION = { x: 0, y: 0 };

export const Dummies = () => {
  const { cardDropPosition, listDropPosition } = useContext(DragAndDropContext);

  const cardDropPositionIsDefault =
    cardDropPosition?.x === DEFAULT_DROP_POSITION.x &&
    cardDropPosition?.y === DEFAULT_DROP_POSITION.y;

  const listDropPositionIsDefault =
    listDropPosition?.x === DEFAULT_DROP_POSITION.x &&
    listDropPosition?.y === DEFAULT_DROP_POSITION.y;

  return (
    <>
      {createPortal(
        <>
          {!cardDropPositionIsDefault && (
            <DropDummyCard
              dropPosition={cardDropPosition ?? DEFAULT_DROP_POSITION}
            />
          )}
          {!listDropPositionIsDefault && (
            <DropDummyList
              dropPosition={listDropPosition ?? DEFAULT_DROP_POSITION}
            />
          )}
        </>,
        document.body,
      )}
    </>
  );
};
