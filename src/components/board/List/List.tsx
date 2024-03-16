import { KanbanCard, KanbanList } from "../../../types";
import { EditableText } from "../../utils/EditableText/EditableText";
import styles from "./List.module.css";
import MakeNewCard from "./MakeNewCard/MakeNewCard";

type ListProps = React.PropsWithChildren & {
	list: KanbanList;
};

export default function List({ children, list }: ListProps) {
	function unshiftCard() {
		// TODO 
		// ...
	}

	return (
		<li className={styles.list}>
			<ListHeader
				listName={list.name}
				id={list.id}
			/>
			<ul className={styles.list_cards_wrapper}>{children}</ul>
			<MakeNewCard unshiftCard={unshiftCard}/>
		</li>
	);
}

type ListHeaderProps = {
	listName: string;
	id: string;
};
  
function ListHeader({listName, id}: ListHeaderProps) {
	return <h2 className={styles.list_name_header}>
		<EditableText 
			value={listName}
			id={id}
		/>
	</h2>
}