import { UserDto } from '../../../../dto/interfaces.ts';
import { Prisma } from '../../../prisma/client.ts';

export const userSelect = {
    id: true,
    name: true,
    boards: {
        select: {
            id: true,
            name: true,
        },
    },
    refreshTokenVersion: true,
} satisfies Prisma.UserSelect;

export const getUserDto = <
    T extends Prisma.UserGetPayload<{ select: typeof userSelect }>,
>(
    user: T,
): UserDto => ({
    id: user.id,
    name: user.name,
    boards: user.boards,
});
