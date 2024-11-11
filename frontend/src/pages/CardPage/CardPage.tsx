import React from "react";

import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import styles from "./CardPage.module.css";

interface CardPageProps {}

export const CardPage: React.FC<CardPageProps> = () => {
  // pages should not import other pages, later this will be done by router
  return <NotFoundPage />;
};
