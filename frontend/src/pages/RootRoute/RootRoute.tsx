import { useUnit } from "effector-react";
import React, { useEffect } from "react";
import { Outlet, ScrollRestoration, useNavigate } from "react-router";
import { Routes } from "src/App";
import { userApi } from "src/entities/User/model";
import { State } from "src/shared/StateModel/model";

interface RootRouteProps {}

export const RootRoute: React.FC<RootRouteProps> = () => {
  const { fetchMyself, user } = useUnit(userApi);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.fetchMyselfState === State.initial) {
      fetchMyself();
    }

    if (user?.fetchMyselfState === State.error) {
      navigate(Routes.login);
    }

    if (user?.fetchMyselfState === State.success) {
      navigate(Routes.project);
    }
  }, [fetchMyself, navigate, user?.fetchMyselfState]);

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
};
