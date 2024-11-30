import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';

export const deleteCardController = async (
    ctx: RouterContext<(typeof routes)['deleteCard']>,
) => {
    const cardId = Number(ctx.params.id);

    await prisma.card.delete({ where: { id: cardId } });

    const responseBody: interfaces.DeleteCardResponseDto = { success: true };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
