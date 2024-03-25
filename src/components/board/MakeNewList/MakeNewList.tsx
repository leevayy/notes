import { useUnit } from "effector-react";
import { KanbanList } from "../../../types";
import { getId } from "../../../utils/utils";
import { listCreated } from "./model";
import styles from "./MakeNewList.module.css";

type MakeNewListProps = {
    position: KanbanList["position"];
}

export default function MakeNewList({ position }: MakeNewListProps) {
    const createList = useUnit(listCreated);

	const emptyList: KanbanList = {
		name: "",
		position: position,
		cards: [],
		id: getId(),
	};

	function handleClick() {
		createList(emptyList);
	}

	return (
		<button className={styles.make_new_list} onClick={handleClick}>
			Make New List
		</button>
	);
}
