import { create, Payload } from 'djwt';

export const createJwtToken = async (
    payload: Payload,
    key: CryptoKey,
) => {
    const token = await create({ alg: 'HS256', typ: 'JWT' }, payload, key);

    return token;
};
