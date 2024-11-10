import { createEvent, createStore } from "effector";

export const $inEditModeId = createStore<string | null>(null);

export const editableTextClicked = createEvent<string>();

export const editableTextBlured = createEvent();

$inEditModeId.on(editableTextClicked, (_, cardId: string) => cardId);

$inEditModeId.on(editableTextBlured, () => null);
