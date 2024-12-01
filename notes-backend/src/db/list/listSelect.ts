import { ListDto } from '../../../../dto/interfaces.ts';
import { Prisma } from '../../../prisma/client.ts';
import { cardSelect, getCardDto } from '../card/cardSelect.ts';

export const listSelect: Prisma.ListSelect = {
    id: true,
    name: true,
    position: true,
    cards: {
        select: cardSelect,
    },
    BoardId: true,
};

export const getListDto = (
    list: Prisma.ListGetPayload<{ select: typeof listSelect }>,
): ListDto => ({
    id: list.id,
    name: list.name,
    position: list.position,
    cards: list.cards.map((card) =>
        getCardDto(
            // type assertion because type inferring doesn't work for some reason
            card as Prisma.CardGetPayload<{ select: typeof cardSelect }>,
            list.BoardId,
        )
    ),
    boardId: list.BoardId,
});
