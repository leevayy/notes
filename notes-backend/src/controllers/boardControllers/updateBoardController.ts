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

    // const board = await prisma.board.update({
    //     where: { id: boardId },
    //     select: boardSelect,
    //     data: {
    //         name: body.name,
    //     },
    // });

    const board = await prisma.$transaction(async (tx) => {
        if (body.listsOrder) {
            const updates = body.listsOrder.map((id, index) => ({
                id: id,
                position: index,
            }));

            const BATCH_SIZE = 50;
            const chunks = chunk(updates, BATCH_SIZE);

            for (const batch of chunks) {
                await Promise.all(
                    batch.map(({ id, position }) =>
                        tx.list.update({
                            where: { id },
                            data: { position },
                        })
                    ),
                );
            }
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
