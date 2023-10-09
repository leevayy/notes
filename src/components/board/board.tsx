import { useState } from "react";
import { KanbanList, KanbanBoard, KanbanCard } from "./../../types";
import { toSortedByPosition, getId } from "../../utils/utils";
import { List } from "./list";
import { cookSetHasPositionPosition } from "./utils";

export function Board({ board }: { board: KanbanBoard }) {
  const [lists, setLists] = useState(board.lists);
  const [currentList, setCurrentList] = useState<KanbanList | null>(null);

  /**
   * Returns a function which can set cards of list with specified ID
   */
  function cookSetCards(listId: KanbanList["id"]) {
    return function setCards(cards: KanbanCard[]) {
      setLists(
        [...lists].map((list) => {
          if (list.id === listId) {
            list.cards = cards;
          }
          return list;
        })
      );
    };
  }

  return (
    <div className="board">
      <ul className="board-section">
        {toSortedByPosition(lists).map((list) => (
          <List
            list={list}
            setCards={cookSetCards(list.id)}
            setListPosition={cookSetHasPositionPosition(lists, setLists)}
            key={list.id}
            currentList={currentList}
            setCurrentList={setCurrentList}
          />
        ))}
        <MakeNewList lists={lists} setLists={setLists} />
      </ul>
    </div>
  );
}

type MakeNewListsProps = {
  lists: KanbanList[];
  setLists: (state: KanbanList[]) => void;
};

function MakeNewList(props: MakeNewListsProps) {
  const emptyList: KanbanList = {
    name: "",
    position: props.lists.length,
    cards: [],
    id: getId(),
  };

  function handleClick() {
    props.setLists([...props.lists, emptyList]);
  }

  return (
    <button className="make-new-list" onClick={handleClick}>
      Make New List
    </button>
  );
}
