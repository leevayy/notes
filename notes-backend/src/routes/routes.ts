export const routes = {
    ping: '/ping',

    // createBoard: '/board/new',
    getBoard: '/board/:id',
    updateBoard: '/board/update/:id',
    // deleteBoard: '/board/delete/:id',

    createList: '/list/new',
    getList: '/list/:id',
    updateList: '/list/update/:id',
    deleteList: '/list/delete/:id',

    createCard: '/card/new',
    getCard: '/card/:id',
    updateCard: '/card/update/:id',
    deleteCard: '/card/delete/:id',
} as const;
