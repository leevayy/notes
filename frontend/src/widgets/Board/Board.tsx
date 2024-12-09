import { EntityId, ListDto } from "@dto/interfaces";
import { useUnit } from "effector-react";
import { isEqual } from "moderndash";
import { useState } from "react";
import { createPortal } from "react-dom";
import Card from "src/entities/Card/Card";
import DropDummyCard from "src/entities/DropDummy/DropDummyCard";
import DropDummyList from "src/entities/DropDummy/DropDummyList";
import MakeNewList from "src/entities/MakeNewList/MakeNewList";
import { userApi } from "src/entities/User/model";

import List, { getTopOffset } from "../../features/List/List";
import { Position } from "../../types";
import styles from "./Board.module.css";
import { $boards, boardApi } from "./model";

// code, as bad as in handling card drop on the list
// i still cannot figure out how to calculate padding on the fly
// needs to be readjasted with each design change
const BOARD_PADDING = 30;
const LISTS_GAP = 36;

const DEFAULT_DROP_POSITION = { x: 0, y: 0 };

const Dummies = ({
  cardDropPosition: dropPosition,
  listDropPosition,
}: {
  cardDropPosition: Position;
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

const getListDropCoordinates = (
  dragEvent: React.DragEvent<HTMLUListElement>,
) => {
  const listsElement = dragEvent.currentTarget;
  const listElements = Array.from(listsElement.children);
  const listsElementRect = listsElement.getBoundingClientRect();

  const topOffset = getTopOffset(listsElementRect);
  const gap = LISTS_GAP;
  const dropX = dragEvent.clientX;

  let currentInsertionX = BOARD_PADDING;

  for (const [listIndex, list] of listElements.entries()) {
    const nextInsertionX =
      currentInsertionX + list.clientWidth + (listIndex !== 0 ? gap : 0);

    const droppedBeforeNextOffset = nextInsertionX > dropX;

    if (droppedBeforeNextOffset) {
      const droppedInFirstHalfOfList =
        dropX < currentInsertionX + gap + list.clientWidth / 2;

      return {
        x: droppedInFirstHalfOfList
          ? currentInsertionX + gap / 2 - 6
          : nextInsertionX + gap / 2 - 6,
        y: BOARD_PADDING + topOffset,
      };
    }
    currentInsertionX = nextInsertionX;
  }

  return {
    x: currentInsertionX + gap / 2 - 6,
    y: BOARD_PADDING + topOffset,
  };
};

const getListsNewOrder = (
  draggedList: ListDto,
  event: React.DragEvent<HTMLUListElement>,
  lists: ListDto[],
) => {
  const listsMiddlePositions = Array.from(event.currentTarget.children)
    .slice(0, -1)
    .map((element) => {
      const { x, y, width } = element.getBoundingClientRect();

      return {
        x: x + width / 2,
        y,
      };
    });

  const listElements = lists.map((list, index) => ({
    id: list.id,
    position:
      list.id === draggedList.id
        ? getListDropCoordinates(event)
        : listsMiddlePositions[index],
  }));

  return listElements
    .toSorted((a, b) => a.position.x - b.position.x)
    .map((list) => list.id);
};

type BoardProps = {};

export const Board: React.FC<BoardProps> = () => {
  const [cardDropPosition, setCardDropPosition] = useState<Position>(
    DEFAULT_DROP_POSITION,
  );
  const resetCardDropPosition = () =>
    setCardDropPosition(DEFAULT_DROP_POSITION);
  const [draggedCardId, setDraggedCardId] = useState<EntityId | null>(null);

  const [listDropPosition, setListDropPosition] = useState<Position>(
    DEFAULT_DROP_POSITION,
  );
  const resetListDropPosition = () =>
    setListDropPosition(DEFAULT_DROP_POSITION);
  const [draggedListId, setDraggedListId] = useState<EntityId | null>(null);

  const { changeBoard } = useUnit(boardApi);
  const { user } = useUnit(userApi);

  const boards = useUnit($boards);
  const board = boards[user.boards[0]?.id];

  if (!board) {
    return null;
  }

  const dragEventIsAboutList = draggedListId && !draggedCardId;

  function dragOverHandler(e: React.DragEvent<HTMLUListElement>) {
    e.preventDefault();

    if (!dragEventIsAboutList) {
      return;
    }

    const coordinates = getListDropCoordinates(e);

    setListDropPosition(coordinates);
  }

  function dropHandler(e: React.DragEvent<HTMLUListElement>) {
    e.preventDefault();

    if (!dragEventIsAboutList) {
      return;
    }

    const draggedList = board.lists.find((list) => list.id === draggedListId);

    if (!draggedList) {
      return;
    }

    const newOrder = getListsNewOrder(draggedList, e, board.lists);

    const oldOrder = board.lists.map((list) => list.id);

    if (!isEqual(oldOrder, newOrder)) {
      changeBoard({
        boardId: board.id,
        changes: { listsOrder: newOrder },
      });
    }

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
              setDropPosition={setCardDropPosition}
              resetDropPosition={resetCardDropPosition}
              setDraggedListId={setDraggedListId}
              setDraggedCardId={setDraggedCardId}
            >
              {list.cards.map((card) => {
                return (
                  <Card
                    key={`${list.id}-${card.id}`}
                    card={card}
                    onDragEnd={resetCardDropPosition}
                  />
                );
              })}
            </List>
          );
        })}
        <MakeNewList boardId={board?.id} />
      </ul>
      <Dummies
        cardDropPosition={cardDropPosition}
        listDropPosition={listDropPosition}
      />
    </>
  );
};
