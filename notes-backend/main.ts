import { Application, Router } from "jsr:@oak/oak";
import { prisma } from "./prisma/client.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts"

const router = new Router();

router.get("/ping", (ctx) => {
  ctx.response.body = `pong`;
});

router.get("/board", async (ctx) => {
  ctx.response.body = await prisma.board.findFirst({where: {id: 1}, select: {id: true, name: true, lists: {select: { id: true, name: true, cards: true }}}});
});

const app = new Application();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });
