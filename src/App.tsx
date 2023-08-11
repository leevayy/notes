import React, { useState, useRef } from 'react';
import type { HasPosition, KanbanCard, KanbanList, KanbanBoard, MenuProps, MenuItemProps } from './types'
import { ReactComponent as MenuIcon } from './icons/menu.svg';
import { ReactComponent as UserIcon } from './icons/user-icon.svg';
import './App.css';

const board: KanbanBoard = {
	name: 'Test',
	lists: [
		{
			name: 'Hello!',
			position: 1,
			cards: [
				{
					text: "what's up. if i add a bunch of text it will result in longer card, right? it must"
					, position: 0
				}
			]
		},
		{
			name: 'hola',
			position: 0,
			cards: [
				{
					text: "amigo",
					position: 0
				},
				{
					text: "el gato",
					position: 1
				},
				{
					text: "las ninas estoy un poco loco",
					position: 2
				}
			]
		},
		{
			name: 'Привет!',
			position: 2,
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

function MakeNewCardForm() {
	const [hasFocus, setFocus] = useState(false);

	return (
		<form
			className={`make-new-card ${hasFocus ? 'has-focus' : ''}`} method='GET'>
			<input
				name="new-card-text"
				className="new-card-text"
				type="text"
				autoComplete="off"
				placeholder="Make new card"
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
			/>
			<input value="" className="new-card-submit" type='submit' />
		</form>);
}

function toSortedByPosition<T extends HasPosition>(iterable: T[]) {
	if (iterable.length === 0) {
		return [];
	}

	let sorted = [...iterable];
	return sorted.sort((el1, el2) => el1.position - el2.position);
}

function List({ list }: { list: KanbanList }) {
	return (
		<li className="list" draggable>
			<div className="list-name-header">
				<input className="list-name" type="text" value={list.name} />
			</div>
			<ul className="list-cards-wrapper">
				{
					toSortedByPosition(list.cards).map(card =>
						<Card card={card} />)
				}
			</ul>
			<MakeNewCardForm></MakeNewCardForm>
		</li>
	);
}

function Board({ board }: { board: KanbanBoard }) {
	return (
		<div className='board'>
			<ul className="board-section">
				{
					toSortedByPosition(board.lists).map(list => <List list={list} />)
				}
			</ul>			
		</div>
	);
}

function MenuItem(props: MenuItemProps) {
	function itemImage(icon: MenuItemProps["icon"]) {
		const IconComponent = icon;
		return <IconComponent />;
	}


	return (
		<li className='menu-item'>
			<button className="menu-item-icon">
				{itemImage(props.icon)}
			</button>
		</li>
	);
}

function Menu(props: MenuProps) {
	return (
		<ul className='menu'>
			{props.children}
		</ul>
	);
}

function Calendar() {
	return <div className='calendar'> <p>here will be calendar section stay tuned</p></div>
}

function App() {
	return (
		<>
			<Menu>
				<MenuItem name="menu" icon={MenuIcon}></MenuItem>
				<MenuItem name="user-icon" icon={UserIcon}></MenuItem>
			</Menu>
			<Board board={board} />
			<Calendar />
		</>);
}

export default App;
