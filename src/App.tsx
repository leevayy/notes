import { useUnit } from "effector-react";
import Card from "./components/board/Card/Card";
import List from "./components/board/List/List";
import { $board, boardUpdated, fetchBoardFx } from "./components/board/Board/model";
import { useEffect, useState } from "react";
import { Board } from "./components/board/Board/Board";
import { Menu } from "./components/menu/menu";

import { ReactComponent as MenuIcon } from "./icons/menu.svg";
import { ReactComponent as UserIcon } from "./icons/user-icon.svg";
import { ReactComponent as CalendarIcon } from "./icons/calendar-icon.svg";
import MakeNewList from "./components/board/MakeNewList/MakeNewList";
import DropDummyCard from "./components/board/DropDummy/DropDummyCard";
import DropDummyList from "./components/board/DropDummy/DropDummyList";

export type Position = {
	x: number;
	y: number;
};

export default function App() {
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
					{ name: "menu", icon: MenuIcon, align: "left" },
					{ name: "calendar", icon: CalendarIcon, align: "left" },
					{ name: "user-icon", icon: UserIcon, align: "right" },
					{ name: "board-name", text: board.name, align: "center" },
				]}
			/>
			{!dropPositionIsDefault && (
				<DropDummyCard dropPosition={dropPosition} />
			)}
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
								key={board.id + "-" + list.id}
								list={list}
								setDropPosition={setDropPosition}
								resetDropPosition={resetDropPosition}
							>
								{list.cards.map((card) => {
									return (
										<Card
											key={list.id + "-" + card.id}
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
