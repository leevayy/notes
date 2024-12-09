import { getNumericDate } from 'djwt';
import { createJwtToken } from './createJwtToken.ts';
import { getJwtAccessSecret } from './getJwtAccessSecret.ts';
import { getJwtRefreshSecret } from './getJwtRefreshSecret.ts';

export const createAuthTokens = async (
    userId: number,
    refreshTokenVersion: number,
) => {
    const exp15min = getNumericDate(15 * 60);

    const jwtAccessToken = await createJwtToken(
        {
            userId,
            exp: exp15min,
        },
        await getJwtAccessSecret(),
    );

    const exp30days = getNumericDate(30 * 24 * 60 * 60);

    const jwtRefreshToken = await createJwtToken(
        {
            userId,
            refreshTokenVersion,
            jwtAccessToken,
            exp: exp30days,
        },
        await getJwtRefreshSecret(),
    );

    return { jwtAccessToken, jwtRefreshToken };
};
