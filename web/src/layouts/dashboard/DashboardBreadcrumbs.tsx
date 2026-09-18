import type { UIMatch } from "react-router";
import { useMatches } from "react-router";

import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";

export function DashboardBreadcrumbs() {
  const matches = useMatches() as UIMatch<
    unknown,
    { crumb: (params: Record<string, string | undefined>) => string }
  >[];

  const crumbs = matches
    .filter(match => Boolean(match.handle))
    .map(match => ({
      href: match.pathname,
      label: match.handle.crumb(match.params),
    }));

  return <Breadcrumbs crumbs={crumbs} />;
}
