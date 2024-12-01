import { Bars, Calendar } from "@gravity-ui/icons";
import { Button, User } from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import iconUrl from "src/assets/user-icon.svg";
import DropDummyCard from "src/entities/DropDummy/DropDummyCard";
import DropDummyList from "src/entities/DropDummy/DropDummyList";
import { Header } from "src/shared/Header/Header";
import { Position } from "src/types";
// import { boardUpdated, fetchBoardFx } from "src/widgets/Board/_model";
import { Board } from "src/widgets/Board/Board";
import { $boards, boardApi, getBoardFx } from "src/widgets/Board/model";

export const BOARD_ID = 1;

export default function ProjectPage() {
  const { fetchBoard } = useUnit(boardApi);

  useEffect(() => {
    fetchBoard({ boardId: BOARD_ID });
  }, [fetchBoard]);

  const boards = useUnit($boards);
  const board = boards[BOARD_ID];
  const isPending = useUnit(getBoardFx.pending);

  return (
    <>
      <Header
        items={[
          { name: "menu", icon: Bars, align: "left" },
          { name: "calendar", icon: Calendar, align: "left" },
          {
            name: "user-icon",
            icon: () => <User avatar={{ imgUrl: iconUrl }} />,
            align: "right",
          },
          {
            name: "board-name",
            text: isPending ? t("born_icy_grizzly_pout") : board?.name,
            align: "center",
          },
        ]}
      />
      {/* {!dropPositionIsDefault && <DropDummyCard dropPosition={dropPosition} />}
      {!listDropPositionIsDefault && (
        <DropDummyList dropPosition={listDropPosition} />
      )} */}
      {isPending ? t("born_icy_grizzly_pout") : <Board />}
    </>
  );
}
