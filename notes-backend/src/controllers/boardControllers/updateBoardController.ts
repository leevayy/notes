import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { prisma } from '../../../prisma/client.ts';
import {
    UpdateBoardRequestDto,
    UpdateBoardResponseDto,
} from '../../../../dto/interfaces.ts';
import { boardSelect, getBoardDto } from '../../db/board/boardSelect.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { chunk } from '@std/collections';

export const updateBoardController = async (
    ctx: RouterContext<(typeof routes)['updateBoard']>,
) => {
    const boardId = Number(ctx.params.id);

    const body = await ctx.request.body.json() as UpdateBoardRequestDto['body'];

    const board = await prisma.$transaction(async (tx) => {
        const listsOrder = body.listsOrder;

        if (listsOrder) {
            const updates = listsOrder.map((id, index) => ({
                id,
                position: index,
            }));

            const OFFSET = 1_000_000;

            const chunks = chunk(updates, 50);

            for (const chunk of chunks) {
                await Promise.all(
                    chunk.map((update) =>
                        tx.list.update({
                            where: { id: update.id },
                            data: { position: update.position + OFFSET },
                        })
                    ),
                );
            }

            await tx.list.updateMany({
                where: { BoardId: boardId, position: { gte: OFFSET } },
                data: { position: { decrement: OFFSET } },
            });
        }

        const board = await tx.board.update({
            where: { id: boardId },
            select: boardSelect,
            data: {
                name: body.name,
            },
        });

        return board;
    });

    const response: UpdateBoardResponseDto = {
        board: getBoardDto(board),
    };

    ctx.response.status = Status.OK;
    ctx.response.body = response;
};
