import { BoardDto } from "@dto/interfaces";
import { useUnit } from "effector-react";
import { PropsWithChildren, useState } from "react";
import Card from "src/entities/Card/Card";
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

type BoardProps = PropsWithChildren & {
  board?: BoardDto;
  setListDropPosition?: React.Dispatch<React.SetStateAction<Position>>;
  resetListDropPosition?: () => void;
};

export function Board({
  children,
  setListDropPosition,
  resetListDropPosition,
}: BoardProps) {
  const board = useUnit($boards)[BOARD_ID];

  // const [draggedList, setDraggedList] = useUnit([$draggedList, listDragged]);
  // const draggedCard = useUnit($draggedCard);

  // const insertList = useUnit(listInserted);
  // const removeList = useUnit(listRemoved);

  // const dragEventIsAboutList = draggedList && !draggedCard;

  // function dragOverHandler(e: React.DragEvent<HTMLUListElement>) {
  //   e.preventDefault();

  //   if (!dragEventIsAboutList) {
  //     return;
  //   }

  //   const { insertionX: x, insertionY: y } = getListDropPosition(e);

  //   setListDropPosition({ x, y });
  // }

  // function dropHandler(e: React.DragEvent<HTMLUListElement>) {
  //   e.preventDefault();

  //   if (!dragEventIsAboutList) {
  //     return;
  //   }

  //   const { position: listDropPosition } = getListDropPosition(e);

  //   insertList({
  //     list: {
  //       ...draggedList,
  //       id: getId(),
  //       position: listDropPosition,
  //     },
  //     insertionIndex: listDropPosition,
  //   });

  //   removeList(draggedList["id"]);
  //   resetListDropPosition();
  //   setDraggedList(null);
  // }

  const defaultDropPosition = { x: 0, y: 0 };

  const [_dropPosition, setDropPosition] =
    useState<Position>(defaultDropPosition);
  const resetDropPosition = () => setDropPosition(defaultDropPosition);

  // const [listDropPosition, setListDropPosition] =
  //   useState<Position>(defaultDropPosition);
  // const resetListDropPosition = () => setListDropPosition(defaultDropPosition);

  // useEffect(() => {
  //   async function fetchData() {
  //     const { board } = await fetchBoardFx({ pathParams: { id: "1" } });

  //     boardUpdated(board);
  //   }

  //   fetchData();
  // }, []);

  // const dropPositionIsDefault =
  //   dropPosition.x === defaultDropPosition.x &&
  //   dropPosition.y === defaultDropPosition.y;

  // const listDropPositionIsDefault =
  //   listDropPosition.x === defaultDropPosition.x &&
  //   listDropPosition.y === defaultDropPosition.y;

  return (
    <>
      <ul
        className={styles.board}
        // onDragOver={dragOverHandler}
        // onDrop={dropHandler}
      >
        {board?.lists.map((list) => {
          return (
            <List
              key={`${board.id}-${list.id}`}
              list={list}
              setDropPosition={setDropPosition}
              resetDropPosition={resetDropPosition}
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
        <MakeNewList position={board?.lists.length} boardId={board?.id} />
      </ul>
    </>
  );
}
