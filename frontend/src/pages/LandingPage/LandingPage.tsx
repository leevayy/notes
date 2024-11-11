import React from "react";

import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import styles from "./LandingPage.module.css";

interface LandingPageProps {}

export const LandingPage: React.FC<LandingPageProps> = () => {
  // pages should not import other pages, later this will be done by router
  return <NotFoundPage />;
};
