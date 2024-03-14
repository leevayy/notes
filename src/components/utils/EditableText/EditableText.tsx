import { useRef, useEffect, useState } from "react";
import { useUnit } from "effector-react";
import { $inEditModeId, editableTextClicked, editableTextBlured } from "./model";
import styles from "./EditableText.module.css";

type EditableTextProps = {
	value: string;
	id: string;
};

export function EditableText({ value, id }: EditableTextProps) {
	const [inEditModeId, handleEditableTextClicked, handleEditableTextBlured] = useUnit([
		$inEditModeId,
		editableTextClicked,
		editableTextBlured,
	]);
	const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

	useEffect(() => {
		const textarea = textareaRef;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = textarea.scrollHeight + "px";
		}
	}, [value, textareaRef]);

	const isInEditMode = inEditModeId === id;

	return (
		<div className={styles.editable_text} onClick={() => handleEditableTextClicked(id)}>
			{isInEditMode ? (
				<textarea 
					autoFocus={true} 
					onBlur={handleEditableTextBlured} 
					defaultValue={value} 
					ref={(el) => setTextareaRef(el)} 
				/>
			) : (
				value
			)}
		</div>
	);
}
