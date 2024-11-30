import { CardDto } from "@dto/interfaces";
import { createEvent, sample } from "effector";
import { $board, boardUpdated } from "src/widgets/Board/model";

export const cardUpdated = createEvent<CardDto>();

sample({
  source: $board,
  clock: cardUpdated,
  fn: (board, updatedCard) => {
    const updatedLists = board.lists.map((list) => {
      const updatedCardIndex = list.cards.findIndex(
        (c) => c.id === updatedCard.id,
      );
      const listHasCardUpdatedCard = updatedCardIndex !== -1;

      if (!listHasCardUpdatedCard) {
        return list;
      }

      return {
        ...list,
        cards: list.cards.map((card, cardIndex) => {
          if (cardIndex === updatedCardIndex) {
            return updatedCard;
          }

          return card;
        }),
      };
    });

    const nextBoard = {
      ...board,
      lists: updatedLists,
    };

    return nextBoard;
  },
  target: boardUpdated,
});
