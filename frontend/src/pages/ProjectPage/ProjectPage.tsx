import { Flex, Spin } from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import { t } from "i18next";
import { useEffect } from "react";
import { CardDrawer } from "src/entities/CardDrawer/CardDrawer";
import { userApi } from "src/entities/User/model";
import { Board } from "src/widgets/Board/Board";
import { boardApi, getBoardFx } from "src/widgets/Board/model";
import { Calendar } from "src/widgets/Calendar/Calendar";

export default function ProjectPage() {
  const { fetchBoard } = useUnit(boardApi);
  const { user } = useUnit(userApi);

  useEffect(() => {
    const boardId = user.boards[0]?.id;

    if (boardId) {
      fetchBoard({ boardId });
    }
  }, [fetchBoard, user]);

  const isPending = useUnit(getBoardFx.pending);

  return (
    <>
      {isPending ? (
        <Flex direction="column" centerContent={true}>
          {t("born_icy_grizzly_pout")}
          <Spin />
        </Flex>
      ) : (
        <>
          <Board />
          <Calendar />
        </>
      )}
      <CardDrawer />
    </>
  );
}
