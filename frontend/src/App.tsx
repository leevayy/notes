import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";

import { ThemeProvider } from "@gravity-ui/uikit";
import { createBrowserRouter, RouterProvider } from "react-router";

import { AuthPage } from "./pages/AuthPage/AuthPage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import { RootRoute } from "./pages/RootRoute/RootRoute";

export enum Routes {
  root = "/",
  login = "/login",
  project = "/project",
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
    ],
  },
]);

export const App: React.FC = () => {
  return (
    <ThemeProvider theme="light">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
