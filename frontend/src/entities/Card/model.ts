import {
  CardDto,
  CreateCardRequestDto,
  EntityId,
  UpdateCardRequestDto,
} from "@dto/interfaces";
import { createCard, deleteCard, updateCard } from "api/generatedApi";
import { createEffect, createEvent, createStore, sample } from "effector";

// When clock is triggered, read the value from source and trigger target with it.

// If the clock is not passed, sample will be triggered on every source update.
// If the filter is not passed, continue as it is. If filter return false or contains Store<false> cancel execution otherwise continue
// If the fn is passed, pass value from source through before passing to target
// If the target is not passed, create it and return from sample()

const addCard = createEvent<CreateCardRequestDto["body"]>();
const changeCard = createEvent<{
  cardId: EntityId;
  changes: UpdateCardRequestDto["body"];
}>();
const removeCard = createEvent<EntityId>();

const createCardFx = createEffect(createCard);
const updateCardFx = createEffect(updateCard);
const deleteCardFx = createEffect(deleteCard);

sample({
  clock: addCard,
  fn: (card) => ({
    body: {
      listId: card.listId,
      text: card.text,
      description: card.description,
      position: card.position,
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

$cards.on(deleteCardFx.done, (state, { params }) => ({
  ...state,
  [params.pathParams.id]: undefined,
}));

export const cardApi = { addCard, changeCard, removeCard };
