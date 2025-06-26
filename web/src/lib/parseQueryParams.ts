import { ZodObject } from 'zod/v4';

export const parseQueryParams = <T extends ZodObject>(
  request: Request,
  schema: T,
) => {
  const url = new URL(request.url);
  const entries = Object.fromEntries(url.searchParams.entries());
  return schema.parse(entries);
};
