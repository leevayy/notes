import { Text, TextProps } from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import { useEffect, useState } from "react";

import styles from "./EditableText.module.css";
import {
  $inEditModeId,
  editableTextBlured,
  editableTextClicked,
} from "./model";

type EditableTextProps = TextProps & {
  value: string;
  id: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  alignCenter?: boolean;
  shouldAutoResize?: boolean;
  onClick?: () => void;
};

export function EditableText({
  value,
  id,
  onChange,
  alignCenter,
  shouldAutoResize,
  onClick,
  ...textProps
}: EditableTextProps) {
  const [inEditModeId, handleEditableTextClicked, handleEditableTextBlured] =
    useUnit([$inEditModeId, editableTextClicked, editableTextBlured]);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(
    null,
  );

  useEffect(() => {
    const textarea = textareaRef;

    if (textarea && shouldAutoResize) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value, textareaRef, shouldAutoResize]);

  useEffect(() => {
    if (textareaRef !== null) {
      textareaRef.setSelectionRange(value.length, value.length);
    }
  }, [textareaRef, value.length]);

  const isInEditMode = inEditModeId === id;

  return (
    <div
      className={`${styles.editable_text} ${alignCenter ? styles.center : ""}`}
      onClick={() => {
        onClick?.();
        handleEditableTextClicked(id);
      }}
    >
      <Text {...textProps}>
        {isInEditMode ? (
          <textarea
            style={{
              overflow: shouldAutoResize ? "auto" : "hidden",
            }}
            autoFocus={true}
            onBlur={handleEditableTextBlured}
            onKeyDown={({ key }) => {
              if (key === "Enter") {
                handleEditableTextBlured();
              }
            }}
            value={value}
            ref={(el) => setTextareaRef(el)}
            onChange={onChange}
          />
        ) : (
          value
        )}
      </Text>
    </div>
  );
}
