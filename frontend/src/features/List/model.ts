import {
  CreateListRequestDto,
  EntityId,
  ListDto,
  UpdateListRequestDto,
} from "@dto/interfaces";
import { createList, deleteList, updateList } from "api/generatedApi";
import { createEffect, createEvent, createStore, sample } from "effector";

const addList = createEvent<CreateListRequestDto["body"]>();

const changeList = createEvent<{
  listId: EntityId;
  changes: UpdateListRequestDto["body"];
}>();

const removeList = createEvent<EntityId>();

export const createListFx = createEffect(createList);

export const deleteListFx = createEffect(deleteList);

export const updateListFx = createEffect(updateList);

sample({
  clock: addList,
  fn: (list) => ({
    body: list,
  }),
  target: createListFx,
});

sample({
  clock: changeList,
  fn: (changeListData) => ({
    pathParams: {
      id: String(changeListData.listId),
    },
    body: changeListData.changes,
  }),
  target: updateListFx,
});

sample({
  clock: removeList,
  fn: (listId) => ({ pathParams: { id: String(listId) } }),
  target: deleteListFx,
});

export type ListModel = Omit<ListDto, "cards"> & {
  cardsOrder: EntityId[];
};

export const getListModelFromDto = (list: ListDto): ListModel => ({
  ...list,
  cardsOrder: list.cards.map((card) => card.id),
});

export const $lists = createStore<Record<EntityId, ListModel>>({});

$lists.on(createListFx.doneData, (state, { list }) => ({
  ...state,
  [list.id]: getListModelFromDto(list),
}));

$lists.on(updateListFx.doneData, (state, { list }) => ({
  ...state,
  [list.id]: getListModelFromDto(list),
}));

$lists.on(deleteListFx.done, (state, { params }) => {
  const { id } = params.pathParams;

  const newState = { ...state };

  delete newState[Number(id)];

  return newState;
});

export const listApi = { addList, changeList, removeList };
