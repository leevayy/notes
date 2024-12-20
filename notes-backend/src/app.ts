import { Application } from 'jsr:@oak/oak';
import { oakCors } from 'https://deno.land/x/cors/mod.ts';
import { router } from './routes/index.ts';
import { authMiddleware } from './middleware/auth/authMiddleware.ts';

export const app = new Application();

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get('X-Response-Time');
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

app.use(
    oakCors({
        origin: [
            'http://localhost:5173',
            'http://localhost:4173',
            'http://leevayy.ru',
            'https://leevayy.ru',
            'http://notes.leevayy.ru',
            'https://notes.leevayy.ru',
        ],
        credentials: true,
    }),
);
app.use(authMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());
