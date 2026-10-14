import { useSearchParams } from "react-router";

import { paths } from "@/config/paths";

function toSameOriginPath(value: string | null) {
  if (!value || !URL.canParse(value, window.location.origin)) {
    return undefined;
  }

  const url = new URL(value, window.location.origin);
  if (url.origin !== window.location.origin) {
    return undefined;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function useRedirectTo() {
  const [searchParams] = useSearchParams();
  const redirectTo = toSameOriginPath(searchParams.get("redirectTo"));

  return {
    destination: redirectTo ?? paths.dashboard.overview.path,
    redirectTo,
  };
}
