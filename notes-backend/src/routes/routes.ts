export const routes = {
    ping: '/api/ping',

    createBoard: '/api/board/new',
    getBoard: '/api/board/:id',
    updateBoard: '/api/board/update/:id',
    deleteBoard: '/api/board/delete/:id',

    createList: '/api/list/new',
    getList: '/api/list/:id',
    updateList: '/api/list/update/:id',
    deleteList: '/api/list/delete/:id',

    createCard: '/api/card/new',
    getCard: '/api/card/:id',
    updateCard: '/api/card/update/:id',
    deleteCard: '/api/card/delete/:id',

    authRegister: '/api/auth/register',
    authLogin: '/api/auth/login',
    authLogout: '/api/auth/logout',

    getMyself: '/api/users/self',
    getUser: '/api/users/:id',
} as const;

export type Routes = typeof routes[keyof typeof routes];
