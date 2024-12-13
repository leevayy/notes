import { Container, Flex } from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import { t } from "i18next";
import React, { useEffect } from "react";
import { Outlet, ScrollRestoration, useNavigate } from "react-router";
import { Routes } from "src/App";
import { DrawerContextProvider } from "src/entities/CardDrawer/CardDrawer";
import { userApi } from "src/entities/User/model";
import { Header } from "src/features/Header/Header";
import { State } from "src/shared/StateModel/model";
import { $boards, getBoardFx } from "src/widgets/Board/model";

interface RootRouteProps {}

export const RootRoute: React.FC<RootRouteProps> = () => {
  const { fetchMyself, user } = useUnit(userApi);

  const boards = useUnit($boards);
  const board = boards[user.boards[0]?.id];
  const isPending = useUnit(getBoardFx.pending);

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
    <DrawerContextProvider>
      <Header
        boardName={isPending ? t("born_icy_grizzly_pout") : (board?.name ?? "")}
      />
      <Flex grow={1} centerContent={true} direction="column">
        <Outlet />
        <ScrollRestoration />
      </Flex>
    </DrawerContextProvider>
  );
};
