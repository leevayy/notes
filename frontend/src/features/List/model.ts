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
// TODO
// const moveCard = createEvent<{
//   cardId: CardDto["id"];
//   fromListId: ListDto["id"];
//   toListId: ListDto["id"];
// }>();

export const createListFx = createEffect(createList);
const updateListFx = createEffect(updateList);
const deleteListFx = createEffect(deleteList);

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

export const $lists = createStore<Record<EntityId, Omit<ListDto, "cards">>>({});

$lists.on(createListFx.doneData, (state, { list }) => ({
  ...state,
  [list.id]: list,
}));

$lists.on(updateListFx.doneData, (state, { list }) => ({
  ...state,
  [list.id]: list,
}));

$lists.on(deleteListFx.done, (state, { params }) => {
  const { id } = params.pathParams;

  const newState = { ...state };

  delete newState[Number(id)];

  return newState;
});

export const listApi = { addList, changeList, removeList };
