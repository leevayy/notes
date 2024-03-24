import { useUnit } from "effector-react";
import Card from "./components/board/Card/Card";
import List from "./components/board/List/List";
import { $board, boardUpdated, fetchBoardFx } from "./components/board/model";
import { useEffect, useState } from "react";
import { Board } from "./components/board/Board/Board";

export default function App() {
	const board = useUnit($board);
	const isPending = useUnit(fetchBoardFx.pending);
	const [dropPosition, setDropPosition] = useState(0);

	useEffect(() => {
		async function fetchData() {
			boardUpdated(await fetchBoardFx());
		}

		fetchData();
	}, []);

	return (
		<>
			{
				dropPosition
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
										return <Card key={list.id + '-' + card.id} card={card}/>
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