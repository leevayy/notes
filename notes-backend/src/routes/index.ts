import { Router } from 'jsr:@oak/oak';
import { routes } from './routes.ts';
import { validateRequestData } from '../middleware/validation/validateRequestData.ts';
import {
    createCardRequestDtoSchema,
    createListRequestDtoSchema,
    deleteCardRequestDtoSchema,
    deleteListRequestDtoSchema,
    getBoardRequestDtoSchema,
    getCardRequestDtoSchema,
    updateBoardRequestDtoSchema,
    updateCardRequestDtoSchema,
    updateListRequestDtoSchema,
} from '../../zod/interfaces.ts';
import {
    getBoardController,
    updateBoardController,
} from '../controllers/boardControllers/index.ts';
import {
    createListController,
    deleteListController,
    updateListController,
} from '../controllers/listControllers/index.ts';
import {
    createCardController,
    deleteCardController,
    getCardController,
    updateCardController,
} from '../controllers/cardControllers/index.ts';

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
router.post(
    routes.createList,
    validateRequestData<typeof routes.createList>(createListRequestDtoSchema),
    createListController,
);

router.post(
    routes.updateList,
    validateRequestData<typeof routes.updateList>(updateListRequestDtoSchema),
    updateListController,
);

router.delete(
    routes.deleteList,
    validateRequestData<typeof routes.deleteList>(deleteListRequestDtoSchema),
    deleteListController,
);
