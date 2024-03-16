import { useUnit } from "effector-react";
import Card from "./components/board/Card/Card";
import List from "./components/board/List/List";
import { $board, boardUpdated, fetchBoardFx } from "./components/board/model";
import { useEffect } from "react";

export default function App() {
	const board = useUnit($board);
	const isPending = useUnit(fetchBoardFx.pending);

	useEffect(() => {
		async function fetchData() {
			boardUpdated(await fetchBoardFx());
		}

		fetchData();
	}, []);

	return (
		<>
			{
				isPending ?
				'fetching' :
				board &&
				<List list={board.lists[1]}>
						{
							(board.lists[1]).cards.map(card => <Card key={`${board.lists[0].id}-${card.id}`} card={card}/>)
						}
				</List>
			}
		</>		
	);
}