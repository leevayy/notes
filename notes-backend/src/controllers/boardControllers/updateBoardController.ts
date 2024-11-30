import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { prisma } from '../../../prisma/client.ts';
import {
    UpdateBoardRequestDto,
    UpdateBoardResponseDto,
} from '../../../../dto/interfaces.ts';
import { boardSelect } from '../../db/board/boardSelect.ts';
import { Status } from 'jsr:@oak/commons@1/status';

export const updateBoardController = async (
    ctx: RouterContext<(typeof routes)['updateBoard']>,
) => {
    const boardId = Number(ctx.params.id);

    const body = await ctx.request.body.json() as UpdateBoardRequestDto['body'];

    const board = await prisma.board.update({
        where: { id: boardId },
        select: boardSelect,
        data: {
            name: body.name,
        },
    });

    const response: UpdateBoardResponseDto = {
        board,
    };

    ctx.response.status = Status.OK;
    ctx.response.body = response;
};
