export interface HasPosition {
	position: number;
}

export interface KanbanCard extends HasPosition {
	text: string;
};

export interface KanbanList extends HasPosition {
	name: string;
	cards: KanbanCard[];
};

export interface KanbanBoard {
	name: string;
	lists: KanbanList[];
};

export interface MenuItemProps {
	name: string;
	icon: React.FunctionComponent;
}

export interface MenuProps {
	children?: React.ReactNode; 
}
