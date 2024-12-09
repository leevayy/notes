import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { getListDto, listSelect } from '../../db/list/listSelect.ts';

export const createListController = async (
    ctx: RouterContext<(typeof routes)['createList']>,
) => {
    const body = await ctx.request.body
        .json() as interfaces.CreateListRequestDto['body'];

    const list = await prisma.$transaction(async (tx) => {
        const listsCount = await tx.list.count({
            where: { BoardId: body.boardId },
        });

        const list = await tx.list.create({
            data: {
                BoardId: body.boardId,
                name: body.name ?? '',
                position: listsCount,
            },
            select: listSelect,
        });

        return list;
    });

    const responseBody: interfaces.CreateListResponseDto = {
        list: getListDto(list),
    };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
