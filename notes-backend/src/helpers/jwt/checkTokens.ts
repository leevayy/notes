import { Payload, verify } from 'djwt';
import { getJwtAccessSecret } from './getJwtAccessSecret.ts';
import { getJwtRefreshSecret } from './getJwtRefreshSecret.ts';
import { prisma } from '../../../prisma/client.ts';
import { EntityId } from '../../../../dto/interfaces.ts';
import { userSelect } from '../../db/user/userSelect.ts';
import { UserAuthType } from '../../types.ts';

export const ACCESS_TOKEN_COOKIE = 'accessToken';
export const REFRESH_TOKEN_COOKIE = 'refreshToken';

const getValidUserId = (data: Payload) => {
    const userId = Number(data?.userId);

    if (!userId || isNaN(userId)) {
        throw new Error('Invalid token payload');
    }

    return userId;
};

export const checkTokens = async (
    accessToken: string,
    refreshToken: string,
): Promise<
    {
        userId: EntityId;
        isAccessTokenExpired: false;
    } | {
        userId: EntityId;
        user: UserAuthType;
        isAccessTokenExpired: true;
    }
> => {
    try {
        const data = await verify(accessToken, await getJwtAccessSecret());

        return {
            userId: getValidUserId(data),
            isAccessTokenExpired: false,
        };
    } catch {
        // token is expired or signed with a different secret
        // so now check refresh token
    }

    let data;
    try {
        data = await verify(refreshToken, await getJwtRefreshSecret());
    } catch (_error) {
        throw new Error('No refresh token');
    }

    const user = await prisma.user.findUnique({
        where: {
            id: getValidUserId(data),
        },
        select: userSelect,
    });

    if (
        !user || user.refreshTokenVersion !== data.refreshTokenVersion ||
        data.jwtAccessToken !== accessToken
    ) {
        throw new Error('Unauthorized');
    }

    return {
        userId: user.id,
        user: user,
        isAccessTokenExpired: true,
    };
};
