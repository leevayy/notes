import { RouterContext, Status } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import { GetMyselfResponseDto } from '../../../../dto/interfaces.ts';
import { prisma } from '../../../prisma/client.ts';
import { getUserDto, userSelect } from '../../db/user/userSelect.ts';

export const getMyselfController = async (
    ctx: RouterContext<(typeof routes)['getMyself']>,
) => {
    const userId = ctx.state.userId;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: userSelect,
    });

    if (!user) {
        ctx.response.status = Status.BadRequest;
        ctx.response.body = {
            message: 'Bad authorization tokens',
        };

        return;
    }

    const responseBody: GetMyselfResponseDto = {
        user: getUserDto(user),
    };

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
