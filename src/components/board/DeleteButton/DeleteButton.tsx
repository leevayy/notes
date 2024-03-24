import styles from "./DeleteButton.module.css";

type DeleteButtonProps = {
    onClick: () => void
}

export default function DeleteButton({onClick}: DeleteButtonProps) {
    return <button
        className={styles.delete_button}
        onClick={onClick}
    />
}