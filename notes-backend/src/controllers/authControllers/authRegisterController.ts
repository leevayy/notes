import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import {
    AuthRegisterRequestDto,
    AuthRegisterResponseDto,
} from '../../../../dto/interfaces.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';
import { prisma } from '../../../prisma/client.ts';
import { getUserDto, userSelect } from '../../db/user/userSelect.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import {
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
} from '../../helpers/jwt/checkTokens.ts';
import { createAuthTokens } from '../../helpers/jwt/createAuthTokens.ts';

export const authRegisterController = async (
    ctx: RouterContext<(typeof routes)['authRegister']>,
) => {
    const body = await ctx.request.body
        .json() as AuthRegisterRequestDto['body'];

    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const sameLoginCount = await prisma.user.count({
        where: {
            login: body.login,
        },
    });

    if (sameLoginCount !== 0) {
        ctx.response.status = Status.Conflict;
        ctx.response.body = {
            messgae: 'User with this login already exists',
        };

        return;
    }

    const user = await prisma.user.create({
        data: {
            name: body.name,
            login: body.login,
            password: hashedPassword,
            refreshTokenVersion: 0,
        },
        select: userSelect,
    });

    const responseBody: AuthRegisterResponseDto = {
        user: getUserDto(user),
    };

    const { jwtAccessToken, jwtRefreshToken } = await createAuthTokens(
        user.id,
        user.refreshTokenVersion,
    );

    await ctx.cookies.set(ACCESS_TOKEN_COOKIE, jwtAccessToken);
    await ctx.cookies.set(REFRESH_TOKEN_COOKIE, jwtRefreshToken);

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
