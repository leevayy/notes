import { ZodError } from 'https://deno.land/x/zod@v3.23.8/ZodError.ts';
import { EntityId } from '../../../dto/interfaces.ts';
import { prisma } from '../../prisma/client.ts';
import { withoutAll } from '@std/collections';
import { z } from 'zod';

export async function validateCardsOrder(
    cardsIds: EntityId[],
    listId: EntityId,
) {
    const cards = await prisma.card.findMany({
        where: { id: { in: cardsIds } },
    });

    const zodIssues = cards.map((card) => {
        if (card.ListId !== listId) {
            return {
                message: 'Some cardIds are invalid.',
                code: 'custom',
                path: ['cardsOrder'],
            } satisfies z.ZodIssue;
        }
    }).filter((issue) => issue !== undefined);

    if (zodIssues.length !== 0) {
        throw new ZodError(zodIssues);
    }

    const actualCards = await prisma.card.findMany({
        where: { ListId: listId },
    });

    const actualCardsIds = actualCards.map((card) => card.id);

    if (actualCards.length !== cardsIds.length) {
        throw new ZodError([{
            message: 'Some cardIds are invalid.',
            code: 'custom',
            path: ['cardsOrder'],
        }]);
    }

    const invalidCards = withoutAll(
        cardsIds,
        actualCardsIds,
    );

    if (invalidCards.length !== 0) {
        throw new ZodError([{
            message: `Some cardIds are invalid: ${invalidCards}.`,
            code: 'custom',
            path: ['cardsOrder'],
        }]);
    }
}
