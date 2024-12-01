import { Prisma } from '../../../prisma/client.ts';

export const cardSelect: Prisma.CardSelect = {
    id: true,
    text: true,
    description: true,
    position: true,
};
