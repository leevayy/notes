const baseUrl = 'http://localhost:8000';

export type ErrorWrapper<TError> =
    | TError
    | { status: 'unknown'; payload: string };

export type NotesFetcherOptions<
    TQueryParams,
    TPathParams,
> = {
    url: string;
    method: string;
    queryParams?: TQueryParams;
    pathParams?: TPathParams;
};

export async function notesFetch<
    TData,
    TQueryParams extends {},
    TPathParams extends {},
>({
    url,
    method,
    pathParams,
    queryParams,
}: NotesFetcherOptions<
    TQueryParams,
    TPathParams
>): Promise<TData> {
    try {
        const response = await window.fetch(
            `${baseUrl}${resolveUrl(url, queryParams, pathParams)}`,
            {
                method: method.toUpperCase(),
            },
        );

        if (!response.ok) {
            let error: ErrorWrapper<{}>;

            try {
                error = await response.json();
            } catch (e) {
                error = {
                    status: 'unknown' as const,
                    payload:
                        e instanceof Error
                            ? `Unexpected error (${e.message})`
                            : 'Unexpected error',
                };
            }

            throw error;
        }

        return await response.json();
    } catch (e) {
        const errorObject: Error = {
            name: 'unknown' as const,
            message:
                e instanceof Error
                    ? `Network error (${e.message})`
                    : 'Network error',
            stack: e as string,
        };

        throw errorObject;
    }
}

const resolveUrl = (
    url: string,
    queryParams: Record<string, string> = {},
    pathParams: Record<string, string> = {},
) => {
    let query = new URLSearchParams(queryParams).toString();

    if (query) query = `?${query}`;

    return (
        url.replace(/\{\w*\}/g, (key) => pathParams[key.slice(1, -1)]) + query
    );
};
