import { redirect } from 'react-router';

export function ensureDefaultQueryParams(
  request: Request,
  defaults: Record<string, string>,
): never | void {
  const url = new URL(request.url);
  let needsRedirect = false;

  for (const [key, val] of Object.entries(defaults)) {
    if (!url.searchParams.has(key)) {
      url.searchParams.set(key, val);
      needsRedirect = true;
    }
  }

  if (needsRedirect) {
    throw redirect(url.toString());
  }
}
