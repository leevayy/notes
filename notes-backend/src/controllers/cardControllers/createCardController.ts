import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';

export const createCardController = async (
    ctx: RouterContext<(typeof routes)['createCard']>,
) => {
    const body = await ctx.request.body
        .json() as interfaces.CreateCardRequestDto['body'];

    const cardsInList = await prisma.card.count({
        where: { ListId: body.listId },
    });

    const card = await prisma.card.create({
        data: {
            ListId: body.listId,
            text: body.text ?? '',
            description: body.description,
            position: cardsInList,
        },
    });

    const responseBody: interfaces.CreateCardResponseDto = { card };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
