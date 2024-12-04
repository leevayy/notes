import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { cardSelect, getCardDto } from '../../db/card/cardSelect.ts';

export const createCardController = async (
    ctx: RouterContext<(typeof routes)['createCard']>,
) => {
    const body = await ctx.request.body
        .json() as interfaces.CreateCardRequestDto['body'];

    const card = await prisma.$transaction(async (tx) => {
        const cardCount = await tx.card.count({
            where: { ListId: body.listId },
        });

        const card = await tx.card.create({
            data: {
                ListId: body.listId,
                text: body.text ?? '',
                description: body.description,
                position: cardCount,
            },
            select: cardSelect,
        });

        return card;
    });

    const responseBody: interfaces.CreateCardResponseDto = {
        card: getCardDto(card),
    };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
