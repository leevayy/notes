import { listSelect } from '../list/listSelect.ts';

export const boardSelect = {
    id: true,
    name: true,
    lists: {
        select: listSelect,
    },
};
