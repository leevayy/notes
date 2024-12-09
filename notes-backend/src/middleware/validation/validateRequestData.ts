import { z, ZodError } from 'zod';
import { Status } from 'jsr:@oak/commons@1/status';
import { Next, RouteParams, RouterContext, State } from 'jsr:@oak/oak';
import { Routes } from '../../routes/routes.ts';

type RequestSchema = z.ZodObject<{
    pathParams?: z.ZodObject<any, any>;
    body?: z.ZodObject<any, any>;
}>;

type RequestSchemaWithValidation = RequestSchema | z.ZodEffects<RequestSchema>;

export function validateRequestData<
    R extends Routes,
    S extends State = Record<string, any>,
>(
    schema: RequestSchemaWithValidation,
) {
    return async (
        ctx: RouterContext<R, RouteParams<R>, S>,
        next: Next,
    ) => {
        try {
            const body = ctx.request.headers.get('Content-Type')?.includes(
                    'application/json',
                )
                ? await ctx.request.body.json()
                : null;

            const params = {
                pathParams: ctx.params,
                body,
            };

            await schema.parseAsync(params);

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
                console.error('Error caught in middleware:');
                console.error(error);
            }
        }
    };
}
