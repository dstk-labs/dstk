import type { ZodObject } from "zod/v4";

export function parseQueryParams<T extends ZodObject>(request: Request, schema: T) {
  const url = new URL(request.url);
  const entries = Object.fromEntries(url.searchParams.entries());
  return schema.parse(entries);
}
