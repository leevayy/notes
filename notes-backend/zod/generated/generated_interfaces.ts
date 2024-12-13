// Generated by ts-to-zod
import { z } from 'zod';

export const entityIdSchema = z.number();

export const pingRequestDtoSchema = z.object({});

export const pingResponseDtoSchema = z.object({});

export const cardDtoSchema = z.object({
  boardId: z.number(),
  listId: z.number(),
  id: entityIdSchema,
  description: z.string().optional().nullable(),
  text: z.string().optional().nullable(),
});

export const createCardRequestDtoSchema = z.object({
  body: z.object({
    listId: entityIdSchema,
    text: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const createCardResponseDtoSchema = z.object({
  card: cardDtoSchema,
});

export const getCardRequestDtoSchema = z.object({
  pathParams: z.object({
    id: z.string(),
  }),
});

export const getCardResponseDtoSchema = z.object({
  card: cardDtoSchema,
});

export const updateCardRequestDtoSchema = z.object({
  pathParams: z.object({
    id: z.string(),
  }),
  body: z.object({
    listId: z.number().optional(),
    text: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const updateCardResponseDtoSchema = z.object({
  card: cardDtoSchema,
});

export const deleteCardRequestDtoSchema = z.object({
  pathParams: z.object({
    id: z.string(),
  }),
});

export const deleteCardResponseDtoSchema = z.object({
  success: z.boolean(),
});

export const listDtoSchema = z.object({
  boardId: z.number(),
  id: entityIdSchema,
  cards: z.array(cardDtoSchema),
  name: z.string().optional().nullable(),
});

export const createListRequestDtoSchema = z.object({
  body: z.object({
    boardId: entityIdSchema,
    name: z.string().optional(),
  }),
});

export const createListResponseDtoSchema = z.object({
  list: listDtoSchema,
});

export const getListRequestDtoSchema = z.object({
  pathParams: z.object({
    id: z.string(),
  }),
});

export const getListResponseDtoSchema = z.object({
  list: listDtoSchema,
});

export const updateListRequestDtoSchema = z.object({
  pathParams: z.object({
    id: z.string(),
  }),
  body: z.object({
    boardId: z.number().optional(),
    name: z.string().optional(),
    cardsOrder: z.array(entityIdSchema).optional(),
  }),
});

export const updateListResponseDtoSchema = z.object({
  list: listDtoSchema,
});

export const deleteListRequestDtoSchema = z.object({
  pathParams: z.object({
    id: z.string(),
  }),
});

export const deleteListResponseDtoSchema = z.object({
  success: z.boolean(),
});

export const boardDtoSchema = z.object({
  id: entityIdSchema,
  name: z.string(),
  lists: z.array(listDtoSchema),
});

export const getBoardRequestDtoSchema = z.object({
  pathParams: z.object({
    id: z.string(),
  }),
});

export const getBoardResponseDtoSchema = z.object({
  board: boardDtoSchema,
});

export const createBoardRequestDtoSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export const createBoardResponseDtoSchema = z.object({
  board: boardDtoSchema,
});

export const updateBoardRequestDtoSchema = z.object({
  pathParams: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().optional(),
    listsOrder: z.array(entityIdSchema).optional(),
  }),
});

export const updateBoardResponseDtoSchema = z.object({
  board: boardDtoSchema,
});

export const simpleBoardsDtoSchema = z.object({
  id: entityIdSchema,
  name: z.string(),
});

export const userDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  boards: z.array(simpleBoardsDtoSchema),
});

export const authRegisterRequestDtoSchema = z.object({
  body: z.object({
    name: z.string(),
    login: z.string(),
    password: z.string(),
  }),
});

export const authRegisterResponseDtoSchema = z.object({
  user: userDtoSchema,
});

export const authLoginRequestDtoSchema = z.object({
  body: z.object({
    login: z.string(),
    password: z.string(),
  }),
});

export const authLoginResponseDtoSchema = z.object({
  user: userDtoSchema,
});

export const authLogoutRequestDtoSchema = z.object({
  body: z.object({}),
});

export const authLogoutResponseDtoSchema = z.object({
  user: userDtoSchema,
});

export const authRefreshTokenRequestDtoSchema = z.object({});

export const authRefreshTokenResponseDtoSchema = z.object({});

export const getMyselfRequestDtoSchema = z.object({});

export const getMyselfResponseDtoSchema = z.object({
  user: userDtoSchema,
});

export const getUserRequestDtoSchema = z.object({
  pathParams: z.object({
    id: entityIdSchema,
  }),
});

export const getUserResponseDtoSchema = z.object({
  user: userDtoSchema,
});
