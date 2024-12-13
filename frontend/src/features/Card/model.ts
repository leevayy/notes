import {
  CardDto,
  CreateCardRequestDto,
  EntityId,
  UpdateCardRequestDto,
} from "@dto/interfaces";
import { createCard, deleteCard, updateCard } from "api/generatedApi";
import { createEffect, createEvent, createStore, sample } from "effector";

const addCard = createEvent<CreateCardRequestDto["body"]>();

const changeCard = createEvent<{
  cardId: EntityId;
  changes: UpdateCardRequestDto["body"];
}>();
const removeCard = createEvent<EntityId>();

const createCardFx = createEffect(createCard);

export const updateCardFx = createEffect(updateCard);
const deleteCardFx = createEffect(deleteCard);

sample({
  clock: addCard,
  fn: (card) => ({
    body: {
      listId: card.listId,
      text: card.text,
      description: card.description,
    },
  }),
  target: createCardFx,
});

sample({
  clock: changeCard,
  fn: (changeCardData) => ({
    pathParams: {
      id: String(changeCardData.cardId),
    },
    body: changeCardData.changes,
  }),
  target: updateCardFx,
});

sample({
  clock: removeCard,
  fn: (cardId) => ({ pathParams: { id: String(cardId) } }),
  target: deleteCardFx,
});

export const $cards = createStore<Record<EntityId, CardDto>>({});

$cards.on(createCardFx.doneData, (state, { card }) => ({
  ...state,
  [card.id]: card,
}));

$cards.on(updateCardFx.doneData, (state, { card }) => ({
  ...state,
  [card.id]: card,
}));

$cards.on(deleteCardFx.done, (state, { params }) => {
  const { id } = params.pathParams;

  const newState = { ...state };

  delete newState[Number(id)];

  return newState;
});

export const cardApi = { cards: $cards, addCard, changeCard, removeCard };
