import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { prisma } from '../../../prisma/client.ts';
import {
    CreateBoardRequestDto,
    CreateBoardResponseDto,
} from '../../../../dto/interfaces.ts';
import { boardSelect, getBoardDto } from '../../db/board/boardSelect.ts';
import { Status } from 'jsr:@oak/commons@1/status';

export const createBoardController = async (
    ctx: RouterContext<(typeof routes)['createBoard']>,
) => {
    const body = await ctx.request.body.json() as CreateBoardRequestDto['body'];

    const board = await prisma.board.create({
        select: boardSelect,
        data: {
            Userid: ctx.state.user.id,
            name: body.name,
        },
    });
    const response: CreateBoardResponseDto = {
        board: getBoardDto(board),
    };

    ctx.response.status = Status.OK;
    ctx.response.body = response;
};
