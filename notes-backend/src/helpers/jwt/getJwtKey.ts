export async function getJwtKey() {
    const jwtSecret = Deno.env.get('JWT_TOKEN_SECRET');

    if (!jwtSecret) {
        throw new Error(
            'JWT_TOKEN_SECRET is not set in the environment variables',
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
