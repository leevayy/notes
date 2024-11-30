import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { listSelect } from '../../db/list/listSelect.ts';

export const createListController = async (
    ctx: RouterContext<(typeof routes)['createList']>,
) => {
    const body = await ctx.request.body
        .json() as interfaces.CreateListRequestDto['body'];

    const listInBoard = await prisma.list.count({
        where: { Board: { some: { id: body.boardId } } },
    });

    const list = await prisma.list.create({
        data: {
            Board: { connect: { id: body.boardId } },
            name: body.name ?? '',
            position: listInBoard,
        },
        select: listSelect,
    });

    const responseBody: interfaces.CreateListResponseDto = { list };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
