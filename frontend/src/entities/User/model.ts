import {
  AuthLoginRequestDto,
  AuthRegisterRequestDto,
  CreateBoardRequestDto,
  DeleteBoardRequestDto,
  UserDto,
} from "@dto/interfaces";
import {
  authLogin,
  authLogout,
  authRegister,
  createBoard,
  deleteBoard,
  getMyself,
} from "api/generatedApi";
import { createEffect, createEvent, createStore, sample } from "effector";
import { State, StateModel } from "src/shared/StateModel/model";

const fetchMyself = createEvent();

const loginUser = createEvent<AuthLoginRequestDto["body"]>();

const registerUser = createEvent<AuthRegisterRequestDto["body"]>();

const logoutUser = createEvent();

const getMyselfFx = createEffect(getMyself);

const authLoginFx = createEffect(authLogin);

const authRegisterFx = createEffect(authRegister);

const authLogoutFx = createEffect(authLogout);

export type ErrorModel = {
  message: string;
};

export type UserModel = UserDto &
  Partial<{
    fetchMyselfState: StateModel;
    loginUserState: StateModel;
    registerUserState: StateModel;
    logoutUserState: StateModel;
    error: ErrorModel;
  }>;

const initialUserModel = {
  id: 0,
  name: "",
  boards: [],
  fetchMyselfState: State.initial,
  loginUserState: State.initial,
  registerUserState: State.initial,
  logoutUserState: State.initial,
};

const $user = createStore<UserModel>(initialUserModel);

sample({
  clock: fetchMyself,
  fn: () => ({}),
  target: getMyselfFx,
});

sample({
  clock: getMyselfFx.pending,
  source: $user,
  fn: (user) => ({
    ...user,
    fetchMyselfState: State.loading,
  }),
  target: $user,
});

sample({
  clock: getMyselfFx.doneData,
  fn: ({ user }) => ({ ...user, fetchMyselfState: State.success }),
  target: $user,
});

sample({
  clock: getMyselfFx.failData,
  source: $user,
  fn: (user, data) => ({
    ...user,
    fetchMyselfState: State.error,
    error: { message: data.message },
  }),
  target: $user,
});

sample({
  clock: loginUser,
  fn: (body) => ({
    body,
  }),
  target: authLoginFx,
});

sample({
  clock: authLoginFx.pending,
  source: $user,
  fn: (user) => ({
    ...user,
    loginUserState: State.loading,
  }),
  target: $user,
});

sample({
  clock: authLoginFx.doneData,
  fn: ({ user }) => ({ ...user, loginUserState: State.success }),
  target: $user,
});

sample({
  clock: authLoginFx.failData,
  source: $user,
  fn: (user, { message }) => ({
    ...user,
    loginUserState: State.error,
    error: { message },
  }),
  target: $user,
});

sample({
  clock: registerUser,
  fn: (body) => ({
    body,
  }),
  target: authRegisterFx,
});

sample({
  clock: authRegisterFx.pending,
  source: $user,
  fn: (user) => ({
    ...user,
    registerUserState: State.loading,
  }),
  target: $user,
});

sample({
  clock: authRegisterFx.doneData,
  fn: ({ user }) =>
    ({ ...user, registerUserState: State.success }) satisfies UserModel,
  target: $user,
});

sample({
  clock: authRegisterFx.failData,
  source: $user,
  fn: (user, { message }) => ({
    ...user,
    registerUserState: State.error,
    error: { message },
  }),
  target: $user,
});

sample({ clock: logoutUser, fn: () => ({ body: {} }), target: authLogoutFx });

sample({
  clock: authLogoutFx.pending,
  source: $user,
  fn: (user) => ({
    ...user,
    logoutUserState: State.loading,
  }),
  target: $user,
});

sample({
  clock: authLogoutFx.doneData,
  fn: ({ user }) =>
    ({ ...user, registerUserState: State.success }) satisfies UserModel,
  target: $user,
});

sample({
  clock: authLogoutFx.failData,
  source: $user,
  fn: (user, { message }) => ({
    ...initialUserModel,
    logoutUserState: State.error,
    error: { message },
  }),
  target: $user,
});

// don't know where to put it and i have 2 hours left
const addBoard = createEvent<CreateBoardRequestDto["body"]>();
const removeBoard = createEvent<DeleteBoardRequestDto["pathParams"]>();

export const createBoardFx = createEffect(createBoard);
export const deleteBoardFx = createEffect(deleteBoard);

sample({
  clock: addBoard,
  fn: (body) => ({ body }),
  target: createBoardFx,
});

sample({
  clock: createBoardFx.doneData,
  source: $user,
  fn: (user, { board }) => ({
    ...user,
    boards: [...user.boards, board],
  }),
  target: $user,
});

sample({
  clock: removeBoard,
  fn: (pathParams) => ({ pathParams }),
  target: deleteBoardFx,
});

sample({
  clock: deleteBoardFx.done,
  source: $user,
  fn: (user, { params }) => ({
    ...user,
    boards: user.boards.filter((b) => b.id !== Number(params.pathParams.id)),
  }),
  target: $user,
});

export const userApi = {
  user: $user,
  fetchMyself,
  loginUser,
  registerUser,
  logoutUser,

  addBoard,
  removeBoard,
};
