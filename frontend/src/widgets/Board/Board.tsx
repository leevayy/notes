import { CardDto, EntityId, ListDto } from "@dto/interfaces";
import { useUnit } from "effector-react";
import { isEqual } from "moderndash";
import { createContext, useState } from "react";
import MakeNewList from "src/entities/MakeNewList/MakeNewList";
import { userApi } from "src/entities/User/model";
import Card from "src/features/Card/Card";
import { $cards } from "src/features/Card/model";
import { $lists, listApi } from "src/features/List/model";
import {
  DEFAULT_DROP_POSITION,
  Dummies,
} from "src/shared/DragAndDrop/Dummies/Dummies";

import List, { getTopOffset } from "../../features/List/List";
import { Position } from "../../types";
import styles from "./Board.module.css";
import { $boards, boardApi } from "./model";

// code, as bad as in handling card drop on the list
// i still cannot figure out how to calculate padding on the fly
// needs to be readjasted with each design change
const BOARD_PADDING = 30;
const LISTS_GAP = 36;

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

// bad code, but i can't figure out how to calculate padding on the fly
// needs to be readjasted with each design change
const CARDS_PADDING = 10;

const getCardDropCoordinates = (dragEvent: React.DragEvent<HTMLLIElement>) => {
  const cards = dragEvent.currentTarget.children.item(1);

  if (!cards) {
    throw new Error("Droped card to list which has no cards wrapper!");
  }

  const cardsArr = Array.from(cards.children);
  const cardsRect = cards.getBoundingClientRect();
  const cardsHeight = cardsRect.height;

  const topOffset = getTopOffset(cardsRect);

  const calculateDropYWithoutOffset = (dropY: number, topOffset: number) => {
    return dropY - topOffset;
  };

  const dropY = calculateDropYWithoutOffset(dragEvent.clientY, topOffset);

  const calculateGap = (cardsArr: Element[], cardsHeight: number) => {
    if (cardsArr.length <= 1) {
      return 0;
    }

    const nonCardSpace = cardsArr.reduce((nonCardSpace, card) => {
      return nonCardSpace - card.clientHeight;
    }, cardsHeight);

    return (nonCardSpace - 2 * CARDS_PADDING) / (cardsArr.length - 1);
  };

  const gap = calculateGap(cardsArr, cardsHeight);

  let currentInsertionY = CARDS_PADDING;

  for (const [cardIndex, card] of cardsArr.entries()) {
    const nextInsertionY =
      currentInsertionY + card.clientHeight + (cardIndex !== 0 ? gap : 0);

    const droppedBeforeNextOffset = nextInsertionY > dropY;

    if (droppedBeforeNextOffset) {
      const droppedInFirstHalfOfCard =
        dropY < currentInsertionY + gap + card.clientHeight / 2;

      if (droppedInFirstHalfOfCard) {
        return {
          x: cardsRect.x + CARDS_PADDING,
          y: currentInsertionY + topOffset,
        };
      } else {
        return {
          x: cardsRect.x + CARDS_PADDING,
          y: nextInsertionY + topOffset,
        };
      }
    }
    currentInsertionY = nextInsertionY;
  }

  return {
    x: cardsRect.x + CARDS_PADDING,
    y: currentInsertionY + topOffset,
  };
};

const getCardsNewOrder = (
  draggedCard: CardDto,
  dragEvent: React.DragEvent<HTMLLIElement>,
  lists: { id: EntityId; cards: CardDto[] }[],
) => {
  const listElements = Array.from(
    dragEvent.currentTarget.parentElement?.children ?? [],
  ).slice(0, -1);

  const listsBoundaries = listElements.map((element) => {
    const { x, width } = element.getBoundingClientRect();

    return {
      left: x,
      right: x + width,
    };
  });

  const dropX = dragEvent.clientX;
  const targetListIndex = listsBoundaries.findIndex((boundaries) => {
    return dropX >= boundaries.left && dropX <= boundaries.right;
  });

  if (targetListIndex === -1) {
    throw new Error("Could not determine the target list.");
  }

  const targetList = lists[targetListIndex];
  const targetCardsElement = listElements[targetListIndex].children.item(1);

  if (!targetCardsElement) {
    throw new Error("Dropped card to a list with no cards wrapper!");
  }

  const targetCardElements = Array.from(targetCardsElement.children);
  const targetCardsElementRect = targetCardsElement.getBoundingClientRect();

  const dropY = dragEvent.clientY;

  // Step 1: Calculate middle Y-coordinates for all cards in the target list
  const targetCardsMiddlePositions = targetCardElements.map((element) => {
    const { y, height } = element.getBoundingClientRect();

    return y + height / 2;
  });

  // Step 2: Create updated target list with the dragged card
  const updatedTargetCards = targetList.cards
    .filter((card) => card.id !== draggedCard.id) // Remove dragged card if it was already in this list
    .map((card, index) => ({
      id: card.id,
      position: {
        y: targetCardsMiddlePositions[index],
        x: targetCardsElementRect.x + CARDS_PADDING,
      },
    }));

  updatedTargetCards.push({
    id: draggedCard.id,
    position: { y: dropY, x: targetCardsElementRect.x + CARDS_PADDING },
  });

  // Step 3: Sort target list cards based on Y-coordinates
  updatedTargetCards.sort((a, b) => a.position.y - b.position.y);

  // Step 4: Return updated order for the target list
  return {
    newListCardIds: updatedTargetCards.map((card) => card.id),
    newListId: targetList.id,
  };
};

type BoardProps = {};

type ContextType = {
  draggedCardId: EntityId | null;
  setDraggedCardId: (id: EntityId | null) => void;
  cardDropPosition: Position;
  setCardDropPosition: (id: Position) => void;
  resetCardDropPosition: () => void;

  draggedListId: EntityId | null;
  setDraggedListId: (id: EntityId | null) => void;
  listDropPosition: Position;
  setListDropPosition: (id: Position) => void;
  resetListDropPosition: () => void;

  isDragEventAboutCard: boolean;
};

export const DragAndDropContext = createContext<Partial<ContextType>>({});

export const DragAndDropContextProvider = DragAndDropContext.Provider;

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

  const { changeBoard, moveCard } = useUnit(boardApi);
  const { changeList } = useUnit(listApi);
  const { user } = useUnit(userApi);

  const boards = useUnit($boards);
  const board = boards[user.boards[0]?.id];

  const lists = useUnit($lists);

  const cards = useUnit($cards);

  if (!board) {
    return null;
  }

  const isDragEventAboutList = draggedListId && !draggedCardId;

  function dragOverHandler(e: React.DragEvent<HTMLUListElement>) {
    e.preventDefault();

    if (!isDragEventAboutList) {
      return;
    }

    const coordinates = getListDropCoordinates(e);

    setListDropPosition(coordinates);
  }

  function dropHandler(e: React.DragEvent<HTMLUListElement>) {
    e.preventDefault();

    if (!isDragEventAboutList) {
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

  const isDragEventAboutCard = draggedCardId && !draggedListId;

  function cardDragOverHandler(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault();

    if (!isDragEventAboutCard) {
      return;
    }

    const coordinates = getCardDropCoordinates(e);

    setCardDropPosition(coordinates);
  }

  function cardDropHandler(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault();

    if (!isDragEventAboutCard) {
      return;
    }

    const draggedCard = cards[draggedCardId];

    if (!draggedCard) {
      return;
    }

    const { newListCardIds, newListId } = getCardsNewOrder(
      draggedCard,
      e,
      board.lists.map(({ id, cards }) => ({
        id,
        cards,
      })),
    );

    const newList = lists[newListId];

    if (!newList) {
      return;
    }

    if (newList.id !== draggedCard.listId) {
      moveCard({
        cardId: draggedCard.id,
        newList,
        newListCardsOrder: newListCardIds,
      });
    } else {
      changeList({
        listId: newList.id,
        changes: {
          cardsOrder: newListCardIds,
        },
      });
    }

    resetCardDropPosition();
    setDraggedCardId(null);
  }

  return (
    <DragAndDropContextProvider
      value={{
        draggedCardId,
        setDraggedCardId,
        cardDropPosition,
        setCardDropPosition,
        resetCardDropPosition,

        draggedListId,
        setDraggedListId,
        listDropPosition,
        setListDropPosition,
        resetListDropPosition,
      }}
    >
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
              dragOverHandler={cardDragOverHandler}
              dropHandler={cardDropHandler}
            >
              {list.cards.map((card) => {
                return <Card key={`${list.id}-${card.id}`} card={card} />;
              })}
            </List>
          );
        })}
        <MakeNewList boardId={board?.id} />
      </ul>
      <Dummies />
    </DragAndDropContextProvider>
  );
};
