import type {
	KanbanBoard
} from './types'
import { ReactComponent as MenuIcon } from './icons/menu.svg';
import { ReactComponent as UserIcon } from './icons/user-icon.svg';
import './App.css';
import {Menu, MenuItem} from './components/menu/menu';
import { Board } from './components/board/board';
import { Calendar } from './components/calendar/calendar';

const board: KanbanBoard = {
	name: 'Test',
	lists: [
		{
			name: 'Hello!',
			position: 0,
			cards: [
				{
					text: "what's up. if i add a bunch of text it will result in longer card, right? it must"
					, position: 0,
					id: 'cueo'
				}
			],
			id: 'x9rh'
		},
		{
			name: 'hola',
			position: 1,
			cards: [
				{
					text: "amigo",
					position: 0,
					id: 'qclh'
				},
				{
					text: "el gato",
					position: 1,
					id: '0p16'
				},
				{
					text: "las ninas estoy un poco loco",
					position: 2,
					id: 'z85y'
				}
			],
			id: 'niq4'
		},
		{
			name: 'Привет!',
			position: 0,
			cards: [
			],
			id: 've9l'
		}
	],
	id: 'vfr8'
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
