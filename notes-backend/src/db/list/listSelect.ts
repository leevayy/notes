import { Prisma } from '../../../prisma/client.ts';
import { cardSelect } from '../card/cardSelect.ts';

export const listSelect: Prisma.ListSelect = {
    id: true,
    name: true,
    position: true,
    cards: {
        select: cardSelect,
    },
    Board: { select: { id: true } },
};
