export async function getJwtAccessSecret() {
    const jwtSecret = Deno.env.get('JWT_ACCESS_SECRET');

    if (!jwtSecret) {
        throw new Error(
            'JWT_ACCESS_SECRET is not set in the environment variables',
        );
    }

    // Convert the string secret to a CryptoKey
    return await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(jwtSecret),
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign', 'verify'],
    );
}
