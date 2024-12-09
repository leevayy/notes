import { generated } from './generated/generated.ts';
import { validateCardsOrder } from './validation/validateCardsOrder.ts';
import { validateListsOrder } from './validation/validateListsOrder.ts';

export const updateListRequestDtoSchema = generated
    .updateListRequestDtoSchema
    .refine(async (requestDto) => {
        const cardsOrder = requestDto.body.cardsOrder;

        if (cardsOrder) {
            await validateCardsOrder(
                cardsOrder,
                Number(requestDto.pathParams.id),
            );
        }

        return true;
    });

export const updateBoardRequestDtoSchema = generated
    .updateBoardRequestDtoSchema
    .refine(async (requestDto) => {
        const listsOrder = requestDto.body.listsOrder;

        if (listsOrder) {
            await validateListsOrder(
                listsOrder,
                Number(requestDto.pathParams.id),
            );
        }

        return true;
    });
