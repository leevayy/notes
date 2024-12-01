import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { getListDto, listSelect } from '../../db/list/listSelect.ts';

export const createListController = async (
    ctx: RouterContext<(typeof routes)['createList']>,
) => {
    try {
        const body = await ctx.request.body
            .json() as interfaces.CreateListRequestDto['body'];

        const listsInBoard = await prisma.list.count({
            where: { BoardId: body.boardId },
        });

        const list = await prisma.list.create({
            data: {
                BoardId: body.boardId,
                name: body.name ?? '',
                position: listsInBoard,
            },
            select: listSelect,
        });

        const responseBody: interfaces.CreateListResponseDto = {
            list: getListDto(list),
        };

        ctx.response.status = Status.OK;
        ctx.response.body = responseBody;
    } catch (error) {
        console.log(error);
    }
};
