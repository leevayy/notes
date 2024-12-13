import {
  configure,
  MarkdownEditorView,
  useMarkdownEditor,
} from "@gravity-ui/markdown-editor";
import { Button, Flex } from "@gravity-ui/uikit";
import { toaster } from "@gravity-ui/uikit/toaster-singleton-react-18";
import { t } from "i18next";
import React from "react";

import styles from "./Editor.module.css";

configure({
  lang: "ru",
});

interface EditorProps {
  updateText: (text: string | null) => void;
  defaultValue: string;
}

export const Editor: React.FC<EditorProps> = ({ defaultValue, updateText }) => {
  const editor = useMarkdownEditor({
    initial: {
      markup: defaultValue,
    },
  });

  const onSubmit = () => {
    updateText(editor.getValue());
  };

  const onCancel = () => {
    editor.replace(defaultValue);
  };

  return (
    <>
      <MarkdownEditorView
        className={styles.editor}
        stickyToolbar={true}
        editor={editor}
        toaster={toaster}
      />
      <Flex gap={4}>
        <Button onClick={onSubmit} view="action" size="l">
          {t("update_card_description")}
        </Button>
        <Button onClick={onCancel} size="l">
          {t("cancel")}
        </Button>
      </Flex>
    </>
  );
};
