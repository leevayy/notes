import { BoardDto } from '../../../../dto/interfaces.ts';
import { Prisma } from '../../../prisma/client.ts';
import { getListDto, listSelect } from '../list/listSelect.ts';

export const boardSelect = {
    id: true,
    name: true,
    lists: {
        select: listSelect,
    },
} satisfies Prisma.BoardSelect;

export const getBoardDto = <
    T extends Prisma.BoardGetPayload<{ select: typeof boardSelect }>,
>(
    list: T,
): BoardDto => ({
    id: list.id,
    name: list.name,
    lists: list.lists.map(getListDto),
});
