import { interfaces } from '@dto';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { boardSelect } from '../../db/board/boardSelect.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { prisma } from '../../../prisma/client.ts';
import { getListDto } from '../../db/list/listSelect.ts';

export const getBoardController = async (
    ctx: RouterContext<(typeof routes)['getBoard']>,
) => {
    const boardId = Number(ctx.params.id);

    const board = await prisma.board.findUnique({
        where: { id: boardId },
        select: boardSelect,
    });

    if (!board) {
        ctx.response.status = Status.NotFound;
        ctx.response.body = { message: 'Board not found' };

        return;
    }

    const responseBody: interfaces.GetBoardResponseDto = {
        board: {
            ...board,
            lists: board.lists.map(getListDto),
        },
    };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
