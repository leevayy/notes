import {
  AuthLoginRequestDto,
  AuthRegisterRequestDto,
  UserDto,
} from "@dto/interfaces";
import {
  authLogin,
  authLogout,
  authRegister,
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

export const userApi = {
  user: $user,
  fetchMyself,
  loginUser,
  registerUser,
  logoutUser,
};
