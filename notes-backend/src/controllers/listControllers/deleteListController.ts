import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { listSelect } from '../../db/list/listSelect.ts';

export const deleteListController = async (
    ctx: RouterContext<(typeof routes)['deleteList']>,
) => {
    const listId = Number(ctx.params.id);

    await prisma.list.delete({
        where: { id: listId },
        select: listSelect,
    });

    const responseBody: interfaces.DeleteListResponseDto = { success: true };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
