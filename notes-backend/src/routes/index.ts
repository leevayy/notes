import { Router } from 'jsr:@oak/oak';
import { routes } from './routes.ts';
import {
    getBoardController,
    updateBoardController,
} from '../controllers/boardControllers/index.ts';
import { validateRequestData } from '../middleware/validation/validateRequestData.ts';
import {
    createCardRequestDtoSchema,
    deleteCardRequestDtoSchema,
    getBoardRequestDtoSchema,
    getCardRequestDtoSchema,
    updateBoardRequestDtoSchema,
    updateCardRequestDtoSchema,
} from '../../zod/interfaces.ts';
import { createCardController } from '../controllers/cardControllers/createCardController.ts';
import { getCardController } from '../controllers/cardControllers/getCardController.ts';
import { updateCardController } from '../controllers/cardControllers/updateCardController.ts';
import { deleteCardController } from '../controllers/cardControllers/deleteCardController.ts';

export const router = new Router();

router.get(routes.ping, (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = 'pong';
});

// BOARD
router.get(
    routes.getBoard,
    validateRequestData<typeof routes.getBoard>(getBoardRequestDtoSchema),
    getBoardController,
);

router.post(
    routes.updateBoard,
    validateRequestData<typeof routes.updateBoard>(updateBoardRequestDtoSchema),
    updateBoardController,
);

// CARD
router.post(
    routes.createCard,
    validateRequestData<typeof routes.createCard>(createCardRequestDtoSchema),
    createCardController,
);

router.get(
    routes.getCard,
    validateRequestData<typeof routes.getCard>(getCardRequestDtoSchema),
    getCardController,
);

router.post(
    routes.updateCard,
    validateRequestData<typeof routes.updateCard>(updateCardRequestDtoSchema),
    updateCardController,
);

router.delete(
    routes.deleteCard,
    validateRequestData<typeof routes.deleteCard>(deleteCardRequestDtoSchema),
    deleteCardController,
);

// LIST
// TODO
// ...
