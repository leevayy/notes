import { interfaces } from '@dto';
import { prisma } from '../../../prisma/client.ts';
import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { cardSelect, getCardDto } from '../../db/card/cardSelect.ts';

export const updateCardController = async (
    ctx: RouterContext<(typeof routes)['updateCard']>,
) => {
    const cardId = Number(ctx.params.id);

    const body = await ctx.request.body
        .json() as interfaces.UpdateCardRequestDto['body'];

    const card = await prisma.$transaction(async (tx) => {
        const newListId = body.listId;

        let newPosition;

        if (newListId) {
            const oldCard = await tx.card.findUnique({
                where: { id: cardId },
                select: { ListId: true, position: true },
            });

            if (!oldCard) {
                throw new Error('No card with that id');
            }

            const oldListId = oldCard?.ListId;

            tx.card.updateMany({
                where: {
                    id: oldListId,
                    position: {
                        gt: oldCard.position,
                    },
                },
                data: {
                    position: {
                        decrement: 1,
                    },
                },
            });

            const cardCount = await tx.card.count({
                where: { ListId: newListId },
            });

            newPosition = cardCount;
        }

        const card = await tx.card.update({
            where: {
                id: cardId,
            },
            data: {
                ListId: body.listId,
                text: body.text,
                description: body.description,
                position: newPosition,
            },
            select: cardSelect,
        });

        return card;
    });

    const responseBody: interfaces.UpdateCardResponseDto = {
        card: getCardDto(card),
    };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
