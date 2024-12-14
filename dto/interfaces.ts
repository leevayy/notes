export type EntityId = number;

export type PingRequestDto = {};

export type PingResponseDto = {};

export interface CardDto {
    boardId: number;
    listId: number;
    id: EntityId;
    description?: string | null;
    text?: string | null;
}

export type CreateCardRequestDto = {
    body: {
        listId: EntityId;
        text?: string;
        description?: string;
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
    cards: CardDto[];
    name?: string | null;
};

export type CreateListRequestDto = {
    body: {
        boardId: EntityId;
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
        cardsOrder?: EntityId[];
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

export type CreateBoardRequestDto = {
    body: {
        name: string;
    }
};

export type CreateBoardResponseDto = {
    board: BoardDto;
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
        listsOrder?: EntityId[];
    }
};

export type UpdateBoardResponseDto = {
    board: BoardDto;
};

export type DeleteBoardRequestDto = {
    pathParams: {
        id: string;
    }
};

export type DeleteBoardResponseDto = {
    success: boolean;
};


export type SimpleBoardsDto = {
    id: EntityId;
    name: string;
}

export type UserDto = {
    id: number;
    name: string;
    boards: SimpleBoardsDto[];
};

export type AuthRegisterRequestDto = {
    body: {
        name: string;
        login: string;
        password: string;
    }
};

export type AuthRegisterResponseDto = {
    user: UserDto;
};

export type AuthLoginRequestDto = {
    body: {
        login: string;
        password: string;
    }
};

export type AuthLoginResponseDto = {
    user: UserDto;
};

export type AuthLogoutRequestDto = {
    body: {},
};

export type AuthLogoutResponseDto = {
    user: UserDto;
};

export type AuthRefreshTokenRequestDto = {};

export type AuthRefreshTokenResponseDto = {};

export type GetMyselfRequestDto = {};

export type GetMyselfResponseDto = {
    user: UserDto;
};

export type GetUserRequestDto = {
    pathParams: {
        id: EntityId
    }
};

export type GetUserResponseDto = {
    user: UserDto;
};

