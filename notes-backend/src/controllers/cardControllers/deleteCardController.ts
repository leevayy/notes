import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';

export const deleteCardController = async (
    ctx: RouterContext<(typeof routes)['deleteCard']>,
) => {
    const cardId = Number(ctx.params.id);

    await prisma.$transaction(async (tx) => {
        const card = await tx.card.delete({
            where: { id: cardId },
        });

        tx.card.updateMany({
            where: { position: { gt: card.position }, ListId: card.ListId },
            data: { position: { decrement: 1 } },
        });
    });

    const responseBody: interfaces.DeleteCardResponseDto = { success: true };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
