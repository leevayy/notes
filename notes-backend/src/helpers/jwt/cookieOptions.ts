export const cookieOptions = {
    httpOnly: true,
    // secure: __prod__,
    sameSite: 'lax',
    path: '/',
    // domain: __prod__ ? `.${process.env.DOMAIN}` : '',
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 year
} as const;
