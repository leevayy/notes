import { ArrowRightFromSquare, Bars, Calendar } from "@gravity-ui/icons";
import { Button, Icon } from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import { t } from "i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Routes } from "src/App";
import { userApi } from "src/entities/User/model";
import { UserData } from "src/entities/User/UserData";
import { Header } from "src/features/Header/Header";
import { State } from "src/shared/StateModel/model";
import { Board } from "src/widgets/Board/Board";
import { $boards, boardApi, getBoardFx } from "src/widgets/Board/model";

export default function ProjectPage() {
  const { fetchBoard } = useUnit(boardApi);
  const { user, logoutUser } = useUnit(userApi);

  const navigate = useNavigate();

  useEffect(() => {
    const boardId = user.boards[0]?.id;

    if (boardId) {
      fetchBoard({ boardId });
    }
  }, [fetchBoard, user]);

  const boards = useUnit($boards);
  const board = boards[user.boards[0]?.id];
  const isPending = useUnit(getBoardFx.pending);

  return (
    <>
      <Header
        items={[
          { name: "menu", content: <Bars />, align: "left" },
          { name: "calendar", content: <Calendar />, align: "left" },
          {
            name: "user-icon",
            content: <UserData username={user?.name ?? t("login")} />,
            align: "right",
          },
          {
            name: "user-logout",
            content: (
              <Button
                view="flat"
                onClick={() => {
                  logoutUser();
                  navigate(Routes.login);
                }}
                loading={user.logoutUserState === State.loading}
                disabled={
                  user.logoutUserState === State.loading ||
                  user.logoutUserState === State.success
                }
              >
                <Icon data={ArrowRightFromSquare} />
              </Button>
            ),
            align: "right",
          },
          {
            name: "board-name",
            content: isPending ? t("born_icy_grizzly_pout") : board?.name,
            align: "center",
          },
        ]}
      />
      {isPending ? t("born_icy_grizzly_pout") : <Board />}
    </>
  );
}
