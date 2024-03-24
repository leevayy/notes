import { useUnit } from "effector-react";
import Card from "./components/board/Card/Card";
import List from "./components/board/List/List";
import { $board, boardUpdated, fetchBoardFx } from "./components/board/model";
import { useEffect, useState } from "react";
import { Board } from "./components/board/Board/Board";
import dummy_styles from "./dummy.module.css";
import { Menu } from "./components/menu/menu";

import { ReactComponent as MenuIcon } from "./icons/menu.svg";
import { ReactComponent as UserIcon } from "./icons/user-icon.svg";
import { ReactComponent as CalendarIcon } from "./icons/calendar-icon.svg";
import MakeNewList from "./components/board/MakeNewList/MakeNewList";


export type Position = {
	x: number,
	y: number
}

export default function App() {
	const board = useUnit($board);
	const isPending = useUnit(fetchBoardFx.pending);
	const [dropPosition, setDropPosition] = useState<Position>({x: 0, y: 0});

	const resetDropPosition = () => setDropPosition({x: 0, y: 0});

	useEffect(() => {
		async function fetchData() {
			boardUpdated(await fetchBoardFx());
		}

		fetchData();
	}, []);

	return (
		<>
			<Menu items={[
				{name: "menu", icon: MenuIcon, align: "left"},
				{name: "calendar", icon: CalendarIcon, align: "left"},
				{name: "user-icon", icon: UserIcon,  align: "right"},
				{name: "board-name", text: board.name, align: "center"}
			]}>
			</Menu>
			{
				(dropPosition.x !== 0 && dropPosition.y !== 0) &&
				<div 
					className={dummy_styles.dummy}
					onDragOver={(e) => e.preventDefault()}
					style={{
						top: dropPosition.y + 5 + 'px',
						left: dropPosition.x + 'px'
					}}
				/>
			}
			{
				isPending ? 
				'fetching' :
				<Board board={board}>
					{
						board.lists.map(list => {
							return <List
								key={board.id + '-' + list.id} 
								list={list} 
								setDropPosition={setDropPosition}
								resetDropPosition={resetDropPosition}
							>
								{
									list.cards.map(card => {
										return <Card 
											key={list.id + '-' + card.id} 
											card={card}
											onDragEnd={resetDropPosition}
										/>
									})
								}
							</List>
						})
					}
					<MakeNewList position={board.lists.length} />
				</Board>
			}
		</>
	);
}