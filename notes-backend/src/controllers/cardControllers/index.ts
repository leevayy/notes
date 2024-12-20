import { createCardController } from './createCardController.ts';
import { getCardController } from './getCardController.ts';
import { updateCardController } from './updateCardController.ts';
import { deleteCardController } from './deleteCardController.ts';

export const cardControllers = {
    createCardController,
    deleteCardController,
    getCardController,
    updateCardController,
};
