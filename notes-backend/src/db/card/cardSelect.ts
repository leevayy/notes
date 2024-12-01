import { CardDto } from '../../../../dto/interfaces.ts';
import { Prisma } from '../../../prisma/client.ts';

export const cardSelect = {
    id: true,
    text: true,
    description: true,
    position: true,
    ListId: true,
    List: { select: { BoardId: true } },
} satisfies Prisma.CardSelect;

export const getCardDto = <
    T extends Prisma.CardGetPayload<{ select: typeof cardSelect }>,
>(
    card: T,
): CardDto => ({
    id: card.id,
    text: card.text,
    description: card.description,
    position: card.position,
    listId: card.ListId,
    boardId: card.List.BoardId,
});
