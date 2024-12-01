import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { cardSelect, getCardDto } from '../../db/card/cardSelect.ts';

export const getCardController = async (
    ctx: RouterContext<(typeof routes)['getCard']>,
) => {
    const cardId = Number(ctx.params.id);

    const card = await prisma.card.findUnique({
        where: { id: cardId },
        select: cardSelect,
    });

    if (!card) {
        ctx.response.status = Status.NotFound;
        ctx.response.body = { message: 'Card not found' };

        return;
    }

    const responseBody: interfaces.GetCardResponseDto = {
        card: getCardDto(card),
    };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
