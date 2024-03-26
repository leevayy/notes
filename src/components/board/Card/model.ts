import { createEvent, sample } from "effector";
import { $board, boardUpdated } from "../Board/model";
import { KanbanCard } from "../../../types";

export const cardUpdated = createEvent<KanbanCard>();

sample({
    source: $board,
    clock: cardUpdated,
    fn: (board, updatedCard) => {
        const updatedLists = board.lists.map(list => {
            const updatedCardIndex = list.cards.findIndex((c) => c.id === updatedCard.id);
            const listHasCardUpdatedCard = ~updatedCardIndex;

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
                })
            }
        })

        const nextBoard = {
            ...board,
            lists: updatedLists
        };

        return nextBoard;
    },
    target: boardUpdated
})
