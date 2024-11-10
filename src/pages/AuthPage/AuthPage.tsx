import React from "react";

import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import styles from "./AuthPage.module.css";

interface AuthPageProps {}

export const AuthPage: React.FC<AuthPageProps> = () => {
  // pages should not import other pages, later this will be done by router
  return <NotFoundPage />;
};
