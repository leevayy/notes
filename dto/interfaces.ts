export type EntityId = number;

export interface CardDto {
    boardId: number;
    listId: number;
    id: EntityId;
    position: number;
    description?: string | null;
    text?: string | null;
}

export type CreateCardRequestDto = {
    body: {
        listId: EntityId;
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
};

export type DeleteCardResponseDto = {
    success: boolean;
};

export type ListDto = {
    boardId: number;
    id: EntityId;
    position: number;
    cards: CardDto[];
    name?: string | null;
};

export type CreateListRequestDto = {
    body: {
        boardId: EntityId;
        position?: number;
        name?: string;
    }
};

export type CreateListResponseDto = {
    list: ListDto;
};

export type GetListRequestDto = {
    pathParams: {
        id: string;
    }
};

export type GetListResponseDto = {
    list: ListDto;
};

export type UpdateListRequestDto = {
    pathParams: {
        id: string;
    },
    body: {
        boardId?: number;
        name?: string;
        position?: number;
    }
};

export type UpdateListResponseDto = {
    list: ListDto;
};

export type DeleteListRequestDto = {
    pathParams: {
        id: string;
    }
};

export type DeleteListResponseDto = {
    success: boolean;
};

export type BoardDto = {
    id: EntityId;
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
