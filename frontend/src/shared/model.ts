import { Theme } from "@gravity-ui/uikit";
import { createEvent, createStore, sample } from "effector";

const THEME_LC = "theme";

const changeTheme = createEvent<Theme>();

const $theme = createStore<Theme>(localStorage.getItem(THEME_LC) ?? "light");

sample({
  clock: changeTheme,
  fn: (theme) => {
    localStorage.setItem(THEME_LC, theme);

    return theme;
  },
  target: $theme,
});

export const themeApi = {
  theme: $theme,
  changeTheme,
};
