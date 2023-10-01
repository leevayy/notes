import { useState } from "react";
import { KanbanList, KanbanBoard, KanbanCard } from "./../../types";
import { toSortedByPosition, getId } from "../../utils/utils";
import { List } from "./list";

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

  function setListPosition(oldPosition: number, newPosition: number) {
    let newLists = [...lists];

    let item = newLists.splice(oldPosition, 1)[0];
    newLists.splice(newPosition, 0, item);

    for (let i = 0; i < newLists.length; i++) {
      newLists[i].position = i;
    }

    console.log(newLists)

    setLists(newLists);
  }

  return (
    <div className="board">
      <ul className="board-section">
        {toSortedByPosition(lists).map((list) => (
          <List 
		  	list={list} 
        setCards={cookSetCards(list.id)} 
        setListPosition={setListPosition}
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
    console.log(props.lists);
  }

  return (
    <button className="make-new-list" onClick={handleClick}>
      Make New List
    </button>
  );
}