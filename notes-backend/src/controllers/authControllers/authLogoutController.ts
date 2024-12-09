import { RouterContext, Status } from 'jsr:@oak/oak';
import { routes } from '../../routes/routes.ts';
import {
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
} from '../../helpers/jwt/checkTokens.ts';
import { cookieOptions } from '../../helpers/jwt/cookieOptions.ts';

export const authLogoutController = async (
    ctx: RouterContext<(typeof routes)['authLogout']>,
) => {
    await ctx.cookies.delete(ACCESS_TOKEN_COOKIE, cookieOptions);
    await ctx.cookies.delete(REFRESH_TOKEN_COOKIE, cookieOptions);

    ctx.response.status = Status.OK;
};
