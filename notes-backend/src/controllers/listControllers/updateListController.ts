import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { listSelect } from '../../db/list/listSelect.ts';

export const updateListController = async (
    ctx: RouterContext<(typeof routes)['updateList']>,
) => {
    const listId = Number(ctx.params.id);

    const body = await ctx.request.body
        .json() as interfaces.UpdateListRequestDto['body'];

    const list = await prisma.list.update({
        where: { id: listId },
        data: {
            Board: body.boardId ? { connect: { id: body.boardId } } : undefined,
            name: body.name,
            position: body.position,
        },
        select: listSelect,
    });

    const responseBody: interfaces.UpdateListResponseDto = {
        list: {
            boardId: list.BoardId,
            id: list.id,
            name: list.name,
            cards: list.cards,
            position: list.position,
        },
    };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
