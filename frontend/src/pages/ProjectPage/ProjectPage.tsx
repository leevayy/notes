import { Bars, Calendar } from "@gravity-ui/icons";
import { User } from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import iconUrl from "src/assets/user-icon.svg";
import Card from "src/entities/Card/Card";
import DropDummyCard from "src/entities/DropDummy/DropDummyCard";
import DropDummyList from "src/entities/DropDummy/DropDummyList";
import MakeNewList from "src/entities/MakeNewList/MakeNewList";
import List from "src/features/List/List";
import { Header } from "src/shared/Header/Header";
import { Position } from "src/types";
import { Board } from "src/widgets/Board/Board";
import { $board, boardUpdated, fetchBoardFx } from "src/widgets/Board/model";

export default function ProjectPage() {
  const board = useUnit($board);
  const isPending = useUnit(fetchBoardFx.pending);

  const defaultDropPosition = { x: 0, y: 0 };

  const [dropPosition, setDropPosition] =
    useState<Position>(defaultDropPosition);
  const resetDropPosition = () => setDropPosition(defaultDropPosition);

  const [listDropPosition, setListDropPosition] =
    useState<Position>(defaultDropPosition);
  const resetListDropPosition = () => setListDropPosition(defaultDropPosition);

  useEffect(() => {
    async function fetchData() {
      boardUpdated(await fetchBoardFx());
    }

    fetchData();
  }, []);

  const dropPositionIsDefault =
    dropPosition.x === defaultDropPosition.x &&
    dropPosition.y === defaultDropPosition.y;

  const listDropPositionIsDefault =
    listDropPosition.x === defaultDropPosition.x &&
    listDropPosition.y === defaultDropPosition.y;

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
          { name: "board-name", text: board.name, align: "center" },
        ]}
      />
      {!dropPositionIsDefault && <DropDummyCard dropPosition={dropPosition} />}
      {!listDropPositionIsDefault && (
        <DropDummyList dropPosition={listDropPosition} />
      )}
      {isPending ? (
        t("born_icy_grizzly_pout")
      ) : (
        <Board
          board={board}
          setListDropPosition={setListDropPosition}
          resetListDropPosition={resetListDropPosition}
        >
          {board.lists.map((list) => {
            return (
              <List
                key={`${board.id}-${list.id}`}
                list={list}
                setDropPosition={setDropPosition}
                resetDropPosition={resetDropPosition}
              >
                {list.cards.map((card) => {
                  return (
                    <Card
                      key={`${list.id}-${card.id}`}
                      card={card}
                      onDragEnd={resetDropPosition}
                    />
                  );
                })}
              </List>
            );
          })}
          <MakeNewList position={board.lists.length} />
        </Board>
      )}
    </>
  );
}
