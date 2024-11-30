import { z, ZodError } from 'https://deno.land/x/zod/mod.ts';
import { Status } from 'jsr:@oak/commons@1/status';
import { Next, RouteParams, RouterContext, State } from 'jsr:@oak/oak';

type RequestSchema = z.ZodObject<{
    pathParams?: z.ZodObject<any, any>;
    body?: z.ZodObject<any, any>;
}>;

export function validateRequestData<
    R extends string,
    P extends RouteParams<R> = RouteParams<R>,
    S extends State = Record<string, any>,
>(
    schema: RequestSchema,
) {
    return async (ctx: RouterContext<R, P, S>, next: Next) => {
        try {
            if (schema.shape.pathParams) {
                schema.shape.pathParams.parse(ctx.params);
            }

            if (schema.shape.body) {
                let body;
                try {
                    body = await ctx.request.body.json();
                } catch (_error) {
                    throw new ZodError([
                        {
                            code: 'custom',
                            message: 'Error while parsing JSON from body',
                            path: ['request', 'body'],
                        },
                    ]);
                }

                schema.shape.body.parse(body);
            }

            await next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));

                ctx.response.status = Status.BadRequest;
                ctx.response.body = errorMessages;
            } else {
                ctx.response.status = Status.InternalServerError;
                ctx.response.body = { message: 'Internal Server Error' };
            }
        }
    };
}
