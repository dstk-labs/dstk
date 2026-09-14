import { ChevronRightIcon } from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router";

export type Crumb = {
  href: string;
  label: string;
};

type BreadcrumbsProps = {
  crumbs: Crumb[];
};

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  if (crumbs.length < 2)
    return null;

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",
        fontSize: "var(--font-size-xs)",
        fontWeight: "var(--font-light)",
        gap: 6,
        marginBottom: "var(--space-6)",
      }}
    >
      {crumbs.map((crumb, index) => {
        const isCurrent = index === crumbs.length - 1;
        return (
          <Fragment key={crumb.href}>
            {index > 0 && (
              <ChevronRightIcon
                size={12}
                style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
              />
            )}
            {isCurrent
              ? (
                  <span
                    aria-current="page"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontWeight: "var(--font-regular)",
                    }}
                  >
                    {crumb.label}
                  </span>
                )
              : (
                  <Link
                    style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
                    to={crumb.href}
                  >
                    {crumb.label}
                  </Link>
                )}
          </Fragment>
        );
      })}
    </nav>
  );
}
