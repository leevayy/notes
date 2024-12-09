import { EntityId, ListDto } from "@dto/interfaces";
import { useUnit } from "effector-react";
import { cardApi } from "src/entities/Card/model";

import { Position } from "../../types";
import styles from "./List.module.css";
import ListHeader from "./ListHeader/ListHeader";
import MakeNewCard, { MakeNewCardProps } from "./MakeNewCard/MakeNewCard";

// bad code, but i can't figure out how to calculate padding on the fly
// needs to be readjasted with each design change
const CARDS_PADDING = 10;

export const getTopOffset = (rect: DOMRect) => {
  const cardsTopScreenOffset = rect.top;
  const windowScroll = window.scrollY;
  const topOffset = cardsTopScreenOffset - windowScroll;

  return topOffset;
};

// const getCardDropPosition = (dragEvent: React.DragEvent<HTMLLIElement>) => {
//   const cards = dragEvent.currentTarget.children.item(1);

//   if (!cards) {
//     throw new Error("Droped card to list which has no cards wrapper!");
//   }

//   const cardsArr = Array.from(cards.children);
//   const cardsRect = cards.getBoundingClientRect();
//   const cardsHeight = cardsRect.height;

//   const topOffset = getTopOffset(cardsRect);

//   const calculateDropYWithoutOffset = (dropY: number, topOffset: number) => {
//     return dropY - topOffset;
//   };

//   const dropY = calculateDropYWithoutOffset(dragEvent.clientY, topOffset);

//   const calculateGap = (cardsArr: Element[], cardsHeight: number) => {
//     if (cardsArr.length <= 1) {
//       return 0;
//     }

//     const nonCardSpace = cardsArr.reduce((nonCardSpace, card) => {
//       return nonCardSpace - card.clientHeight;
//     }, cardsHeight);

//     return (nonCardSpace - 2 * CARDS_PADDING) / (cardsArr.length - 1);
//   };

//   const gap = calculateGap(cardsArr, cardsHeight);

//   let currentInsertionY = CARDS_PADDING;

//   for (const [cardIndex, card] of cardsArr.entries()) {
//     const nextInsertionY =
//       currentInsertionY + card.clientHeight + (cardIndex !== 0 ? gap : 0);

//     const droppedBeforeNextOffset = nextInsertionY > dropY;

//     if (droppedBeforeNextOffset) {
//       const droppedInFirstHalfOfCard =
//         dropY < currentInsertionY + gap + card.clientHeight / 2;

//       if (droppedInFirstHalfOfCard) {
//         return {
//           position: cardIndex,
//           insertionY: currentInsertionY + topOffset,
//           insertionX: cardsRect.x + CARDS_PADDING,
//         };
//       } else {
//         return {
//           position: cardIndex + 1,
//           insertionY: nextInsertionY + topOffset,
//           insertionX: cardsRect.x + CARDS_PADDING,
//         };
//       }
//     }
//     currentInsertionY = nextInsertionY;
//   }

//   return {
//     position: cardsArr.length,
//     insertionY: currentInsertionY + topOffset,
//     insertionX: cardsRect.x + CARDS_PADDING,
//   };
// };

type ListProps = React.PropsWithChildren & {
  list: ListDto;
  setDropPosition: React.Dispatch<React.SetStateAction<Position>>;
  resetDropPosition: () => void;
  setDraggedListId: React.Dispatch<React.SetStateAction<EntityId | null>>;
  setDraggedCardId: React.Dispatch<React.SetStateAction<EntityId | null>>;
};

export default function List({
  children,
  list,
  setDropPosition,
  resetDropPosition,
  setDraggedListId,
  setDraggedCardId,
}: ListProps) {
  const { addCard } = useUnit(cardApi);

  // const [draggedCard, setDraggedCard] = useUnit([$draggedCard, cardDragged]);
  // const insertCard = useUnit(cardInserted);
  // const removeCard = useUnit(cardRemoved);

  // const setDraggedList = useUnit(listDragged);
  // const draggedList = useUnit($draggedList);

  const unshiftCard: MakeNewCardProps["unshiftCard"] = (newCard) =>
    addCard({
      text: newCard.text ?? "",
      listId: list.id,
    });

  // const dragEventIsAboutCard = draggedCard && !draggedList;

  // function dragOverHandler(e: React.DragEvent<HTMLLIElement>) {
  //   e.preventDefault();

  //   if (!dragEventIsAboutCard) {
  //     return;
  //   }

  //   const { insertionX: x, insertionY: y } = getCardDropPosition(e);

  //   setDropPosition({ x, y });
  // }

  // function dropHandler(e: React.DragEvent<HTMLLIElement>) {
  //   e.preventDefault();

  //   if (!dragEventIsAboutCard) {
  //     return;
  //   }

  //   const { position: cardDropPosition } = getCardDropPosition(e);

  //   insertCard({
  //     card: {
  //       ...draggedCard,
  //       id: getId(),
  //       position: cardDropPosition,
  //     },
  //     updatedList: list,
  //     insertionIndex: cardDropPosition,
  //   });

  //   removeCard(draggedCard["id"]);
  //   setDraggedCard(null);
  //   resetDropPosition();
  // }

  function dragHandler(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault();
    setDraggedListId(list.id);
  }

  function dragEndHandler(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault();
    setDraggedListId(null);
  }

  return (
    <li
      className={styles.list}
      // onDragOver={dragOverHandler}
      // onDrop={dropHandler}
      draggable={true}
      onDrag={dragHandler}
      onDragEnd={dragEndHandler}
    >
      <ListHeader list={list} />
      <ul className={styles.list_cards_wrapper}>{children}</ul>
      <MakeNewCard unshiftCard={unshiftCard} />
    </li>
  );
}
