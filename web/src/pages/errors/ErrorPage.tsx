import { Button } from "@mantine/core";
import { SearchXIcon, TriangleAlertIcon } from "lucide-react";
import { isRouteErrorResponse, Link, useNavigate, useRouteError } from "react-router";

import { BrandMark } from "@/components/brandMark/BrandMark";
import { paths } from "@/config/paths";

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const code = isRouteErrorResponse(error) ? error.status : 500;
  const title = notFound ? "Page not found" : "Something went wrong";
  const message = notFound
    ? "The page you're looking for doesn't exist or has been moved. Check the URL or head back to the dashboard."
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred. Please try again in a few minutes.";
  const accent = notFound ? "var(--sky-200)" : "var(--color-error)";

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        overflow: "hidden",
        padding: "var(--space-10) var(--space-6)",
        position: "relative",
        textAlign: "center",
      }}
    >
      <Link
        style={{
          alignItems: "center",
          color: "var(--color-text-primary)",
          display: "flex",
          fontSize: "var(--font-size-base)",
          fontWeight: "var(--font-regular)",
          gap: "var(--space-2)",
          left: "var(--space-6)",
          position: "absolute",
          textDecoration: "none",
          top: "var(--space-6)",
        }}
        to={paths.root.landing.path}
      >
        <BrandMark size={28} />
        DSTK
      </Link>
      <div style={{ maxWidth: 480, position: "relative" }}>
        <div
          style={{
            fontSize: 120,
            fontWeight: "var(--font-display)",
            letterSpacing: -4,
            lineHeight: 1,
            marginBottom: "var(--space-2)",
            opacity: 0.12,
          }}
        >
          {code}
        </div>
        <div
          style={{
            alignItems: "center",
            background: "color-mix(in srgb, currentColor 8%, transparent)",
            border: "1px solid color-mix(in srgb, currentColor 12%, transparent)",
            borderRadius: "var(--radius-full)",
            color: accent,
            display: "flex",
            height: 80,
            justifyContent: "center",
            margin: "-40px auto var(--space-6)",
            position: "relative",
            width: 80,
          }}
        >
          {notFound ? <SearchXIcon size={32} /> : <TriangleAlertIcon size={32} />}
        </div>
        <h1
          style={{
            fontSize: "var(--font-size-2xl)",
            fontWeight: "var(--font-light)",
            margin: "0 0 var(--space-2)",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-light)",
            lineHeight: "var(--leading-relaxed)",
            margin: "0 0 var(--space-8)",
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", justifyContent: "center" }}>
          <Button component={Link} to={paths.dashboard.overview.path}>
            Go to dashboard
          </Button>
          <Button onClick={() => navigate(-1)} variant="default">
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
