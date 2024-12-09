import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';

export const deleteListController = async (
    ctx: RouterContext<(typeof routes)['deleteList']>,
) => {
    const listId = Number(ctx.params.id);

    await prisma.$transaction(async (tx) => {
        const list = await tx.list.delete({
            where: { id: listId },
        });

        tx.list.updateMany({
            where: { position: { gt: list.position }, BoardId: list.BoardId },
            data: { position: { decrement: 1 } },
        });
    });

    const responseBody: interfaces.DeleteListResponseDto = { success: true };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
