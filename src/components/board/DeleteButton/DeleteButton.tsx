import styles from "./DeleteButton.module.css";
import { ReactComponent as DeleteIcon } from "./../../../icons/trash-can.svg";

type DeleteButtonProps = {
    onClick: () => void
}

export default function DeleteButton({onClick}: DeleteButtonProps) {
    return <button
        className={styles.delete_button}
        onClick={onClick}
    >
        <DeleteIcon width={20} height={20} />
    </button>
}