import { RouterContext } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import {
    AuthLoginRequestDto,
    AuthLoginResponseDto,
} from '../../../../dto/interfaces.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';
import { prisma } from '../../../prisma/client.ts';
import { getUserDto, userSelect } from '../../db/user/userSelect.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { createAuthTokens } from '../../helpers/jwt/createAuthTokens.ts';
import {
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
} from '../../helpers/jwt/checkTokens.ts';
import { cookieOptions } from '../../helpers/jwt/cookieOptions.ts';

const errorMessage = 'Wrong credentials';

export const authLoginController = async (
    ctx: RouterContext<(typeof routes)['authRegister']>,
) => {
    const body = await ctx.request.body
        .json() as AuthLoginRequestDto['body'];

    const user = await prisma.user.findUnique({
        where: {
            login: body.login,
        },
        select: {
            ...userSelect,
            password: true,
        },
    });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
        ctx.response.status = Status.Forbidden;
        ctx.response.body = {
            message: errorMessage,
        };

        return;
    }

    const responseBody: AuthLoginResponseDto = {
        user: getUserDto(user),
    };

    const { jwtAccessToken, jwtRefreshToken } = await createAuthTokens(
        user.id,
        user.refreshTokenVersion,
    );

    await ctx.cookies.set(ACCESS_TOKEN_COOKIE, jwtAccessToken, cookieOptions);
    await ctx.cookies.set(REFRESH_TOKEN_COOKIE, jwtRefreshToken, cookieOptions);

    ctx.response.status = Status.OK;
    ctx.response.body = responseBody;
};
