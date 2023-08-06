import React, {useState} from 'react';
import './App.css';

type KanbanCard = {
	text: string
}

type KanbanList = {
	name: string,
	cards: KanbanCard[]
}

type KanbanBoard = {
	name: string,
	lists: KanbanList[]
}

const board: KanbanBoard = {
	name: 'Test',
	lists: [
		{
			name: 'Hello!',
			cards: [
				{
					text: "what's up. if i add a bunch of text it will result in longer card, right? it must"
				}
			]
		},
		{
			name: 'hola',
			cards: [
				{
					text: "amigo"
				},
				{
					text: "el gato"
				},
				{
					text: "las ninas estoy un poco loco"
				}
			]
		},
		{
			name: 'Привет!',
			cards: [
			]
		}
	]
}

function Card({ card }: { card: KanbanCard }) {
	return (
	<li className="card" draggable>
		<p className="card-text">
			{card.text}
		</p>
	</li>)
}

function List({ list }: { list: KanbanList }) {
	return (
		<div className="list" draggable>
			<div className="list-name-header">
				<input className="list-name" type="text" value={list.name} />
			</div>
			<ul className="list-cards-wrapper">
				{
					list.cards.map(card =>
						<Card card={card} />)
				}
			</ul>
			<form className="make-new-card" method='GET'>
				<input name="new-card-text" className="new-card-text" type="text" placeholder='Make new card' />
				<input value=" " className="new-card-submit" type='submit' />
			</form>
		</div>
	);
}

function Board({ board }: { board: KanbanBoard }) {

	let overflow: boolean = false;
	return (
		<div className='board'>
			<div className="board-section">
				{
					board.lists.map(list => <List list={list} />)
				}
			</div>
			{overflow ? <div className="board-scroll-section"> </div> : ''}
		</div>
	);
}

function App() {
	// const [board, setBoard] : [KanbanBoard, any] = useState({name: '', lists: []});
	
	return (
	<>
		<Board board={board} />
	</>);
}

export default App;
