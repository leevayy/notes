import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";
import "./index.css";

import { ThemeProvider } from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router";

import en_keyset from "../messages/en.json";
import ru_keyset from "../messages/ru.json";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import { RootRoute } from "./pages/RootRoute/RootRoute";
import { themeApi } from "./shared/model";

i18next.use(initReactI18next).init({
  resources: {
    ru: { translation: ru_keyset },
    en: { translation: en_keyset },
  },
  lng: "ru",
  fallbackLng: "ru",
});

export enum Routes {
  root = "/",
  login = "/login",
  project = "/project/:id",
  profile = "/profile",
}

const router = createBrowserRouter([
  {
    path: Routes.root,
    element: <RootRoute />,
    errorElement: <NotFoundPage />,
    id: "root",
    children: [
      {
        path: Routes.login,
        element: <AuthPage />,
      },
      {
        path: Routes.project,
        element: <ProjectPage />,
      },
      {
        path: Routes.profile,
        element: <ProfilePage />,
      },
    ],
  },
]);

export const App: React.FC = () => {
  const { theme } = useUnit(themeApi);

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
};
