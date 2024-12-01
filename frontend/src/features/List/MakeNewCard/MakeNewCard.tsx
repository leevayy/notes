import { CardDto } from "@dto/interfaces";
import { useRef, useState } from "react";

import styles from "./MakeNewCard.module.css";

export type MakeNewCardProps = {
  unshiftCard: (card: Pick<CardDto, "text">) => void;
};

export default function MakeNewCard({ unshiftCard }: MakeNewCardProps) {
  const [newCardText, setNewCardText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    if (inputRef) {
      inputRef.current?.blur();
    }

    if (newCardText === "") {
      return;
    }

    unshiftCard({
      text: newCardText,
    });
    setNewCardText("");
  }

  return (
    <form name="make-new-card" className={styles.make_new_card} method="GET">
      <input
        form="make-new-card"
        name="new-card-text"
        className={styles.new_card_text}
        type="text"
        autoComplete="off"
        value={newCardText}
        onChange={(e) => setNewCardText(e.target.value)}
        onKeyDown={({ key }) => {
          if (key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <input
        className={styles.new_card_submit}
        value=""
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        ref={inputRef}
      />
    </form>
  );
}
