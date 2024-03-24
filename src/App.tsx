import { useUnit } from "effector-react";
import Card from "./components/board/Card/Card";
import List from "./components/board/List/List";
import { $board, boardUpdated, fetchBoardFx } from "./components/board/model";
import { useEffect, useState } from "react";
import { Board } from "./components/board/Board/Board";
import dummy_styles from "./dummy.module.css";

export type Position = {
	x: number,
	y: number
}

export default function App() {
	const board = useUnit($board);
	const isPending = useUnit(fetchBoardFx.pending);
	const [dropPosition, setDropPosition] = useState<Position>({x: 0, y: 0});

	useEffect(() => {
		async function fetchData() {
			boardUpdated(await fetchBoardFx());
		}

		fetchData();
	}, []);

	return (
		<>
			{
				(dropPosition.x !== 0 && dropPosition.y !== 0) &&
				<div 
					className={dummy_styles.dummy}
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
							return <List key={board.id + '-' + list.id} list={list} setDropPosition={setDropPosition}>
								{
									list.cards.map(card => {
										return <Card 
											key={list.id + '-' + card.id} 
											card={card}
											onDragEnd={() => setDropPosition({x: 0, y: 0})}
										/>
									})
								}
							</List>
						})
					}
				</Board>
			}
		</>
	);
}