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

    const list = await prisma.list.findUnique({
        where: { id: body.listId },
        select: { BoardId: true, cards: true },
    });

    if (!list) {
        ctx.response.status = Status.NotFound;
        ctx.response.body = { message: 'List not found' };
        return;
    }

    const card = await prisma.card.create({
        data: {
            ListId: body.listId,
            text: body.text ?? '',
            description: body.description,
            position: list.cards.length ?? 0,
        },
        select: cardSelect,
    });

    const responseBody: interfaces.CreateCardResponseDto = {
        card: getCardDto(card, list.BoardId),
    };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
