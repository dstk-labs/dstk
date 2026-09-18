import type { UIMatch } from "react-router";
import { useMatches } from "react-router";

import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";

export function DashboardBreadcrumbs() {
  const matches = useMatches() as UIMatch<
    unknown,
    { crumb: (data?: unknown) => string }
  >[];

  const crumbs = matches
    .filter(match => Boolean(match.handle))
    .map(match => ({
      href: match.pathname,
      label: match.handle.crumb(),
    }));

  return <Breadcrumbs crumbs={crumbs} />;
}
