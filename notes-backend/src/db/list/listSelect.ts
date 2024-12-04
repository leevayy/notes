import { ListDto } from '../../../../dto/interfaces.ts';
import { Prisma } from '../../../prisma/client.ts';
import { cardSelect, getCardDto } from '../card/cardSelect.ts';

export const listSelect = {
    id: true,
    name: true,
    position: true,
    cards: {
        select: cardSelect,
        orderBy: {
            position: 'asc',
        },
    },
    BoardId: true,
} satisfies Prisma.ListSelect;

export const getListDto = <
    T extends Prisma.ListGetPayload<{ select: typeof listSelect }>,
>(
    list: T,
): ListDto => ({
    id: list.id,
    name: list.name,
    // position: list.position,
    cards: list.cards.map(getCardDto),
    boardId: list.BoardId,
});
