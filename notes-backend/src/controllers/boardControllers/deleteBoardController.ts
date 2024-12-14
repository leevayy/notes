import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { prisma } from '../../../prisma/client.ts';
import { DeleteBoardResponseDto } from '../../../../dto/interfaces.ts';
import { Status } from 'jsr:@oak/commons@1/status';

export const deleteBoardController = async (
    ctx: RouterContext<(typeof routes)['deleteBoard']>,
) => {
    const boardId = Number(ctx.params.id);

    await prisma.board.delete({
        where: {
            id: boardId,
        },
    });

    const response: DeleteBoardResponseDto = {
        success: true,
    };

    ctx.response.status = Status.OK;
    ctx.response.body = response;
};
