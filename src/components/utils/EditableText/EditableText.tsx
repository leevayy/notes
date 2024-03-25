import { useEffect, useState } from "react";
import { useUnit } from "effector-react";
import { $inEditModeId, editableTextClicked, editableTextBlured } from "./model";
import styles from "./EditableText.module.css";

type EditableTextProps = {
	value: string;
	id: string;
	onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
	alignCenter?: boolean;
	shouldAutoResize?: boolean;
};

export function EditableText({ value, id, onChange, alignCenter, shouldAutoResize }: EditableTextProps) {
	const [inEditModeId, handleEditableTextClicked, handleEditableTextBlured] = useUnit([
		$inEditModeId,
		editableTextClicked,
		editableTextBlured,
	]);
	const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

	useEffect(() => {
		const textarea = textareaRef;
		if (textarea && shouldAutoResize) {
			textarea.style.height = "auto";
			textarea.style.height = textarea.scrollHeight + "px";
		}
	}, [value, textareaRef]);

	useEffect(() => {
		if (textareaRef !== null) {
			textareaRef.setSelectionRange(value.length, value.length);
		}
	}, [textareaRef]);

	const isInEditMode = inEditModeId === id;

	return (
		<div 
			className={`${styles.editable_text} ${alignCenter ? styles.center : ''}`} 
			onClick={() => handleEditableTextClicked(id)}
		>
			{isInEditMode ? (
				<textarea
					style={{
						overflow: shouldAutoResize ? 'auto' : 'hidden'
					}}
					autoFocus={true}
					onBlur={handleEditableTextBlured} 
					onKeyDown={({key}) => {
						if (key === 'Enter') {
							handleEditableTextBlured()
						}
					}}
					value={value} 
					ref={(el) => setTextareaRef(el)} 
					onChange={onChange}
				/>
			) : (
				value
			)}
		</div>
	);
}
