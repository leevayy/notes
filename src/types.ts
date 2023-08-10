export type KanbanCard = {
	text: string;
};

export type KanbanList = {
	name: string;
	cards: KanbanCard[];
};

export type KanbanBoard = {
	name: string;
	lists: KanbanList[];
};

export type MenuItemProps = {
	name: string;
	icon: React.FunctionComponent;
}

export type MenuProps = {
	children?: React.ReactNode; 
}
