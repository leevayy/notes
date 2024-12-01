import { CardDto, EntityId } from '../../../../dto/interfaces.ts';
import { Prisma } from '../../../prisma/client.ts';

export const cardSelect: Prisma.CardSelect = {
    id: true,
    text: true,
    description: true,
    position: true,
    ListId: true,
};

export const getCardDto = (
    card: Prisma.CardGetPayload<{ select: typeof cardSelect }>,
    boardId: EntityId,
): CardDto => ({
    id: card.id,
    text: card.text,
    description: card.description,
    position: card.position,
    listId: card.ListId,
    boardId,
});
