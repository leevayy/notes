export interface CardDto {
    id: number;
    position: number;
    description?: string | null;
    text?: string | null;
}

export type CreateCardRequestDto = {
    body: {
        listId: number;
        text?: string;
        description?: string;
        position?: number;
    }
};

export type CreateCardResponseDto = {
    card: CardDto;
};

export type GetCardRequestDto = {
    pathParams: {
        id: string;
    }
};

export type GetCardResponseDto = {
    card: CardDto;
};

export type UpdateCardRequestDto = {
    pathParams: {
        id: string;
    },
    body: {
        listId?: number;
        text?: string;
        description?: string;
        position?: number;
    }
};

export type UpdateCardResponseDto = {
    card: CardDto;
};

export type DeleteCardRequestDto = {
    pathParams: {
        id: string;
    }
    body: {
        listId?: number;
        text?: string;
        description?: string;
        position?: number;
    }
};

export type DeleteCardResponseDto = {
    success: boolean;
};

export type ListDto = {
    id: number;
    position: number;
    cards: CardDto[];
    name?: string | null;
};

export type BoardDto = {
    id: number;
    name: string;
    lists: ListDto[];
};

export type GetBoardRequestDto = {
    pathParams: {
        id: string;
    }
};

export type GetBoardResponseDto = {
    board: BoardDto;
};

export type UpdateBoardRequestDto = {
    pathParams: {
        id: string;
    },
    body: {
        name?: string;
    }
};

export type UpdateBoardResponseDto = {
    board: BoardDto;
};
