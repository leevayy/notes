import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';

export const updateCardController = async (
    ctx: RouterContext<(typeof routes)['updateCard']>,
) => {
    const cardId = Number(ctx.params.id);

    const body = await ctx.request.body
        .json() as interfaces.UpdateCardRequestDto['body'];

    const card = await prisma.card.update({
        where: { id: cardId },
        data: {
            List: body.listId ? { connect: { id: body.listId } } : undefined,
            text: body.text,
            description: body.description,
            position: body.position,
        },
    });

    const responseBody: interfaces.UpdateCardResponseDto = { card };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
