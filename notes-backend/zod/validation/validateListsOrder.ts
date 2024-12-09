import { ZodError } from 'https://deno.land/x/zod@v3.23.8/ZodError.ts';
import { EntityId } from '../../../dto/interfaces.ts';
import { prisma } from '../../prisma/client.ts';
import { withoutAll } from '@std/collections';
import { z } from 'zod';

export async function validateListsOrder(
    listsIds: EntityId[],
    boardId: EntityId,
) {
    const lists = await prisma.list.findMany({
        where: { id: { in: listsIds } },
    });

    const zodIssues = lists.map((list) => {
        if (list.BoardId !== boardId) {
            return {
                message: 'Some listIds are invalid.',
                code: 'custom',
                path: ['listsOrder'],
            } satisfies z.ZodIssue;
        }
    }).filter((issue) => issue !== undefined);

    if (zodIssues.length !== 0) {
        throw new ZodError(zodIssues);
    }

    const actualLists = await prisma.list.findMany({
        where: { BoardId: boardId },
    });

    const actualListsIds = actualLists.map((list) => list.id);

    if (actualLists.length !== listsIds.length) {
        throw new ZodError([{
            message: 'Some listIds are invalid.',
            code: 'custom',
            path: ['listsOrder'],
        }]);
    }

    const invalidLists = withoutAll(
        listsIds,
        actualListsIds,
    );

    if (invalidLists.length !== 0) {
        throw new ZodError([{
            message: `Some listIds are invalid: ${invalidLists}.`,
            code: 'custom',
            path: ['listsOrder'],
        }]);
    }
}
