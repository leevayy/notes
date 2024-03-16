import { createEffect, createEvent, createStore } from "effector";
import { KanbanBoard } from "../../types";

const fetchBoard = async () => {
    await new Promise((res, rej) => setTimeout(res, 2000));
    return {
        name: "Some longer header to test this out",
        lists: [
            {
                name: "Hello!",
                position: 0,
                cards: [
                    {
                        text: "what's up. if i add a bunch of text it will result in longer card, right? it must",
                        position: 0,
                        id: "cueo"
                    }
                ],
                id: "x9rh"
            },
            {
                name: "hola",
                position: 1,
                cards: [
                    {
                        text: "amigo",
                        position: 0,
                        id: "qclh"
                    },
                    {
                        text: "el gato",
                        position: 1,
                        id: "0p16"
                    },
                    {
                        text: "las ninas estoy un poco loco",
                        position: 2,
                        id: "z85y"
                    }
                ],
                id: "niq4"
            },
            {
                name: "Привет!",
                position: 2,
                cards: [],
                id: "ve9l"
            }
        ],
        id: "vfr8"
    };
}

export const $board = createStore<KanbanBoard | null>(null);

export const fetchBoardFx = createEffect(fetchBoard);

export const boardUpdated = createEvent<KanbanBoard>();

$board.on(boardUpdated, (_, newBoard) => newBoard);

// !
fetchBoardFx.watch(() => console.log('fetching '));