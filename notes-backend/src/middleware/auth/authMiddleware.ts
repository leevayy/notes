import { Middleware } from 'jsr:@oak/oak';
import { Status } from 'jsr:@oak/commons@1/status';
import { routes } from '../../routes/routes.ts';
import {
    ACCESS_TOKEN_COOKIE,
    checkTokens,
    REFRESH_TOKEN_COOKIE,
} from '../../helpers/jwt/checkTokens.ts';
import { createAuthTokens } from '../../helpers/jwt/createAuthTokens.ts';
import { cookieOptions } from '../../helpers/jwt/cookieOptions.ts';

const errorMessages = {
    ERROR_INVALID_AUTH: 'Authentication failed',
    ACCESS_TOKEN_NOT_PRESENT: 'Access token is not present',
    REFRESH_TOKEN_NOT_PRESENT: 'Refresh token is not present',
};

const ignorePaths: string[] = [
    routes.authRegister,
    routes.authLogin,
    routes.authLogout,
];

export const authMiddleware = (): Middleware => {
    return async (ctx, next) => {
        if (ignorePaths.includes(ctx.request.url.pathname)) {
            await next();

            return;
        }

        const accessToken = await ctx.cookies.get(ACCESS_TOKEN_COOKIE);
        const refreshToken = await ctx.cookies.get(REFRESH_TOKEN_COOKIE);

        if (!accessToken || !refreshToken) {
            ctx.response.status = Status.Forbidden;
            ctx.response.body = {
                message: !accessToken
                    ? errorMessages.ACCESS_TOKEN_NOT_PRESENT
                    : errorMessages.REFRESH_TOKEN_NOT_PRESENT,
            };

            return;
        }

        try {
            const result = await checkTokens(
                accessToken,
                refreshToken,
            );

            if (result.isAccessTokenExpired === true) {
                const { jwtAccessToken, jwtRefreshToken } =
                    await createAuthTokens(
                        result.user.id,
                        result.user.refreshTokenVersion,
                    );

                ctx.cookies.set(
                    ACCESS_TOKEN_COOKIE,
                    jwtAccessToken,
                    cookieOptions,
                );
                ctx.cookies.set(
                    REFRESH_TOKEN_COOKIE,
                    jwtRefreshToken,
                    cookieOptions,
                );
            }

            ctx.state.userId = result.userId;
        } catch (_error) {
            console.log(_error);
            ctx.response.status = Status.Unauthorized;
            ctx.response.body = {
                message: errorMessages.ERROR_INVALID_AUTH,
            };

            return;
        }

        await next();
    };
};
