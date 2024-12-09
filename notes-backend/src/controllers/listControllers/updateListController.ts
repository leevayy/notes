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
        const cardsOrder = body.cardsOrder;

        if (cardsOrder) {
            const updates = cardsOrder.map((id, index) => ({
                id,
                position: index,
            }));

            const OFFSET = 1_000_000;

            const chunks = chunk(updates, 50);

            for (const chunk of chunks) {
                await Promise.all(
                    chunk.map((update) =>
                        tx.card.update({
                            where: { id: update.id },
                            data: { position: update.position + OFFSET },
                        })
                    ),
                );
            }

            await tx.card.updateMany({
                where: { ListId: listId, position: { gte: OFFSET } },
                data: { position: { decrement: OFFSET } },
            });
        }

        const list = await tx.list.update({
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
