import { EntityId } from "@dto/interfaces";
import { useUnit } from "effector-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import Card from "src/entities/Card/Card";
import DropDummyCard from "src/entities/DropDummy/DropDummyCard";
import DropDummyList from "src/entities/DropDummy/DropDummyList";
import MakeNewList from "src/entities/MakeNewList/MakeNewList";
import { BOARD_ID } from "src/pages/ProjectPage/ProjectPage";

import List, { getTopOffset } from "../../features/List/List";
import { Position } from "../../types";
import styles from "./Board.module.css";
import { $boards, boardApi } from "./model";

// code, as bad as in handling card drop on the lise
// i still cannot figure out how to calculate padding on the fly
// needs to be readjasted with each design change
const BOARD_PADDING = 30;
const LISTS_GAP = 36;

const DEFAULT_DROP_POSITION = { x: 0, y: 0 };

const Dummies = ({
  dropPosition,
  listDropPosition,
}: {
  dropPosition: Position;
  listDropPosition: Position;
}) => {
  const dropPositionIsDefault =
    dropPosition.x === DEFAULT_DROP_POSITION.x &&
    dropPosition.y === DEFAULT_DROP_POSITION.y;

  const listDropPositionIsDefault =
    listDropPosition.x === DEFAULT_DROP_POSITION.x &&
    listDropPosition.y === DEFAULT_DROP_POSITION.y;

  return (
    <>
      {createPortal(
        <>
          {!dropPositionIsDefault && (
            <DropDummyCard dropPosition={dropPosition} />
          )}
          {!listDropPositionIsDefault && (
            <DropDummyList dropPosition={listDropPosition} />
          )}
        </>,
        document.body,
      )}
    </>
  );
};

const getListDropPosition = (dragEvent: React.DragEvent<HTMLUListElement>) => {
  const lists = dragEvent.currentTarget;

  const listsRect = lists.getBoundingClientRect();
  const listsArr = Array.from(lists.children);

  const topOffset = getTopOffset(listsRect);

  const gap = LISTS_GAP;

  const dropX = dragEvent.clientX;

  let currentInsertionX = BOARD_PADDING;

  for (const [listIndex, list] of listsArr
    .slice(0, listsArr.length - 1)
    .entries()) {
    const nextInsertionX =
      currentInsertionX + list.clientWidth + (listIndex !== 0 ? gap : 0);

    const droppedBeforeNextOffset = nextInsertionX > dropX;

    if (droppedBeforeNextOffset) {
      const droppedInFirstHalfOfList =
        dropX < currentInsertionX + gap + list.clientWidth / 2;

      if (droppedInFirstHalfOfList) {
        return {
          position: listIndex,
          insertionX: currentInsertionX + gap / 2 - 6,
          insertionY: BOARD_PADDING + topOffset,
        };
      } else {
        return {
          position: listIndex + 1,
          insertionX: nextInsertionX + gap / 2 - 6,
          insertionY: BOARD_PADDING + topOffset,
        };
      }
    }
    currentInsertionX = nextInsertionX;
  }

  return {
    position: listsArr.length,
    insertionX: currentInsertionX + gap / 2 - 6,
    insertionY: BOARD_PADDING + topOffset,
  };
};

type BoardProps = {};

export const Board: React.FC<BoardProps> = () => {
  const [dropPosition, setDropPosition] = useState<Position>(
    DEFAULT_DROP_POSITION,
  );
  const resetDropPosition = () => setDropPosition(DEFAULT_DROP_POSITION);

  const [listDropPosition, setListDropPosition] = useState<Position>(
    DEFAULT_DROP_POSITION,
  );
  const resetListDropPosition = () =>
    setListDropPosition(DEFAULT_DROP_POSITION);

  const { changeBoard } = useUnit(boardApi);

  const boards = useUnit($boards);
  const board = boards[BOARD_ID];

  const [draggedListId, setDraggedListId] = useState<EntityId | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<EntityId | null>(null);

  const dragEventIsAboutList = draggedListId && !draggedCardId;

  function dragOverHandler(e: React.DragEvent<HTMLUListElement>) {
    e.preventDefault();

    if (!dragEventIsAboutList) {
      return;
    }

    const { insertionX: x, insertionY: y } = getListDropPosition(e);

    setListDropPosition({ x, y });
  }

  function dropHandler(e: React.DragEvent<HTMLUListElement>) {
    e.preventDefault();

    if (!dragEventIsAboutList) {
      return;
    }

    const { position: listDropPosition } = getListDropPosition(e);

    const newOrder = board.lists
      .map((list) => list.id)
      .filter((id) => id !== draggedListId)
      .toSpliced(listDropPosition, 0, draggedListId);

    changeBoard({
      boardId: board.id,
      changes: { listsOrder: newOrder },
    });

    resetListDropPosition();
    setDraggedListId(null);
  }

  return (
    <>
      <ul
        className={styles.board}
        onDragOver={dragOverHandler}
        onDrop={dropHandler}
      >
        {board?.lists.map((list) => {
          return (
            <List
              key={`${board.id}-${list.id}`}
              list={list}
              setDropPosition={setDropPosition}
              resetDropPosition={resetDropPosition}
              setDraggedListId={setDraggedListId}
            >
              {list.cards.map((card) => {
                return (
                  <Card
                    key={`${list.id}-${card.id}`}
                    card={card}
                    onDragEnd={resetDropPosition}
                  />
                );
              })}
            </List>
          );
        })}
        <MakeNewList boardId={board?.id} />
      </ul>
      <Dummies
        dropPosition={dropPosition}
        listDropPosition={listDropPosition}
      />
    </>
  );
};
