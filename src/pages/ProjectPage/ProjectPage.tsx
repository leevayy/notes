import { Bars, Calendar } from "@gravity-ui/icons";
import { User } from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import { useEffect, useState } from "react";
import iconUrl from "src/assets/user-icon.svg";
import { Board } from "src/components/Board/Board/Board";
import {
  $board,
  boardUpdated,
  fetchBoardFx,
} from "src/components/Board/Board/model";
import Card from "src/components/Board/Card/Card";
import DropDummyCard from "src/components/Board/DropDummy/DropDummyCard";
import DropDummyList from "src/components/Board/DropDummy/DropDummyList";
import List from "src/components/Board/List/List";
import MakeNewList from "src/components/Board/MakeNewList/MakeNewList";
import { Menu } from "src/components/Menu/Menu";
import { Position } from "src/types";

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
      <Menu
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
        "fetching"
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
