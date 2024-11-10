export type HasPosition = {
  position: number;
};

export type KanbanCard = HasPosition & {
  text: string;
  id: string;
};

export type KanbanList = HasPosition & {
  name: string;
  cards: KanbanCard[];
  id: string;
};

export type KanbanBoard = {
  name: string;
  lists: KanbanList[];
  id: string;
};

export type Position = {
  x: number;
  y: number;
};
