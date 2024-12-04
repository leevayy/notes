import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { getListDto, listSelect } from '../../db/list/listSelect.ts';
import { chunk } from '@std/collections';

export const updateListController = async (
    ctx: RouterContext<(typeof routes)['updateList']>,
) => {
    const listId = Number(ctx.params.id);

    const body = await ctx.request.body
        .json() as interfaces.UpdateListRequestDto['body'];

    const list = await prisma.$transaction(async (tx) => {
        if (body.cardsOrder) {
            // TODO remove type assertion
            // TODO figure out less crappy way to update position
            const randomPosition = (await tx.card.findFirst({
                where: { id: body.cardsOrder[0] },
            }))!.position;
            const isPositionRound =
                Math.trunc(randomPosition) === randomPosition;

            const updates = body.cardsOrder.map((id, index) => ({
                id: id,
                position: index,
            }));

            const BATCH_SIZE = 50;
            const chunks = chunk(updates, BATCH_SIZE);

            for (const batch of chunks) {
                await Promise.all(
                    batch.map(({ id, position }) => {
                        tx.card.update({
                            where: { id },
                            data: {
                                position: isPositionRound
                                    ? position + 0.5
                                    : position,
                            },
                        });
                    }),
                );
            }

            for (const update of updates) {
                await tx.card.update({
                    where: { id: update.id },
                    data: { position: update.position },
                });
            }
        }

        const list = await prisma.list.update({
            where: { id: listId },
            data: {
                Board: body.boardId
                    ? { connect: { id: body.boardId } }
                    : undefined,
                name: body.name,
            },
            select: listSelect,
        });

        return list;
    });

    const responseBody: interfaces.UpdateListResponseDto = {
        list: getListDto(list),
    };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
