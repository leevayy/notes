export const boardSelect = {
    id: true,
    name: true,
    lists: {
        select: {
            id: true,
            name: true,
            position: true,
            cards: {
                select: {
                    id: true,
                    description: true,
                    position: true,
                },
            },
        },
    },
};
