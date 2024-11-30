export const routes = {
    ping: '/ping',

    getBoard: '/board/:id',
    updateBoard: '/board/update/:id',

    createCard: '/card/new',
    getCard: '/card/:id',
    updateCard: '/card/update/:id',
    deleteCard: '/card/delete/:id',
} as const;
