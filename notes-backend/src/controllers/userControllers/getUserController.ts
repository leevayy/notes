import { RouterContext, Status } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { GetUserResponseDto } from '../../../../dto/interfaces.ts';
import { prisma } from '../../../prisma/client.ts';
import { getUserDto, userSelect } from '../../db/user/userSelect.ts';

export const getUserController = async (
    ctx: RouterContext<(typeof routes)['getUser']>,
) => {
    const userId = ctx.params.id;

    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId),
        },
        select: userSelect,
    });

    if (!user) {
        ctx.response.status = Status.NotFound;
        ctx.response.body = {
            message: `User id = ${userId} not found`,
        };

        return;
    }

    const responseBody: GetUserResponseDto = {
        user: getUserDto(user),
    };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
