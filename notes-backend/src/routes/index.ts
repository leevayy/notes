import { Router } from 'jsr:@oak/oak';
import { routes } from './routes.ts';
import { validateRequestData } from '../middleware/validation/validateRequestData.ts';
import { zodDtoInterfaces } from '../../zod/index.ts';
import { boardControllers } from '../controllers/boardControllers/index.ts';
import { listControllers } from '../controllers/listControllers/index.ts';
import { cardControllers } from '../controllers/cardControllers/index.ts';
import { authControllers } from '../controllers/authControllers/index.ts';
import { userControllers } from '../controllers/userControllers/index.ts';

export const router = new Router();

router.get(routes.ping, (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = 'pong';
});

// CARD
router.post(
    routes.createCard,
    validateRequestData<typeof routes.createCard>(
        zodDtoInterfaces.createCardRequestDtoSchema,
    ),
    cardControllers.createCardController,
);

router.get(
    routes.getCard,
    validateRequestData<typeof routes.getCard>(
        zodDtoInterfaces.getCardRequestDtoSchema,
    ),
    cardControllers.getCardController,
);

router.post(
    routes.updateCard,
    validateRequestData<typeof routes.updateCard>(
        zodDtoInterfaces.updateCardRequestDtoSchema,
    ),
    cardControllers.updateCardController,
);

router.delete(
    routes.deleteCard,
    validateRequestData<typeof routes.deleteCard>(
        zodDtoInterfaces.deleteCardRequestDtoSchema,
    ),
    cardControllers.deleteCardController,
);

// LIST
router.post(
    routes.createList,
    validateRequestData<typeof routes.createList>(
        zodDtoInterfaces.createListRequestDtoSchema,
    ),
    listControllers.createListController,
);

router.post(
    routes.updateList,
    validateRequestData<typeof routes.updateList>(
        zodDtoInterfaces.updateListRequestDtoSchema,
    ),
    listControllers.updateListController,
);

router.delete(
    routes.deleteList,
    validateRequestData<typeof routes.deleteList>(
        zodDtoInterfaces.deleteListRequestDtoSchema,
    ),
    listControllers.deleteListController,
);

// BOARD
router.post(
    routes.createBoard,
    validateRequestData<typeof routes.createBoard>(
        zodDtoInterfaces.createBoardRequestDtoSchema,
    ),
    boardControllers.createBoardController,
);

router.get(
    routes.getBoard,
    validateRequestData<typeof routes.getBoard>(
        zodDtoInterfaces.getBoardRequestDtoSchema,
    ),
    boardControllers.getBoardController,
);

router.post(
    routes.updateBoard,
    validateRequestData<typeof routes.updateBoard>(
        zodDtoInterfaces.updateBoardRequestDtoSchema,
    ),
    boardControllers.updateBoardController,
);

router.delete(
    routes.deleteBoard,
    validateRequestData<typeof routes.deleteBoard>(
        zodDtoInterfaces.deleteBoardRequestDtoSchema,
    ),
    boardControllers.deleteBoardController,
);

// AUTH
router.post(
    routes.authRegister,
    validateRequestData<typeof routes.authRegister>(
        zodDtoInterfaces.authRegisterRequestDtoSchema,
    ),
    authControllers.authRegisterController,
);

router.post(
    routes.authLogin,
    validateRequestData<typeof routes.authLogin>(
        zodDtoInterfaces.authLoginRequestDtoSchema,
    ),
    authControllers.authLoginController,
);

router.post(
    routes.authLogout,
    validateRequestData<typeof routes.authLogout>(
        zodDtoInterfaces.authLogoutRequestDtoSchema,
    ),
    authControllers.authLogoutController,
);

// USER
router.get(
    routes.getMyself,
    validateRequestData<typeof routes.getMyself>(
        zodDtoInterfaces.getMyselfRequestDtoSchema,
    ),
    userControllers.getMyselfController,
);

router.get(
    routes.getUser,
    validateRequestData<typeof routes.getUser>(
        zodDtoInterfaces.getUserRequestDtoSchema,
    ),
    userControllers.getUserController,
);
