import { Navigate, Outlet, useLocation } from "react-router";

import { Anchor } from "@/components/anchor/Anchor";
import { paths } from "@/config/paths";
import { useUser } from "@/features/auth/hooks/authHooks";

const footerLinks = [
  { label: `© ${new Date().getFullYear()} DSTK Labs`, link: paths.root.landing.path },
  { label: "About", link: paths.root.about.path },
  { label: "Terms", link: paths.root.terms.path },
  { label: "Privacy", link: paths.root.privacy.path },
  { label: "Careers", link: paths.root.careers.path },
];

const glowStyle = {
  borderRadius: "50%",
  filter: "blur(120px)",
  opacity: 0.04,
  position: "absolute",
} as const;

const UNVERIFIED_PATHS: string[] = [
  paths.auth.verify.path,
  paths.auth.verifyEmail.path,
];

export function AuthLayout() {
  const { user } = useUser();
  const { pathname } = useLocation();

  if (user?.isEmailVerified) {
    return <Navigate to={paths.dashboard.overview.path} />;
  }

  if (user && !UNVERIFIED_PATHS.includes(pathname)) {
    return <Navigate to={paths.auth.verify.path} />;
  }

  return (
    <>
      <div
        aria-hidden
        style={{ inset: 0, overflow: "hidden", position: "fixed", zIndex: -1 }}
      >
        <div
          style={{
            ...glowStyle,
            background: "var(--sky-400)",
            height: "31.25rem",
            right: "-6.25rem",
            top: "-9.375rem",
            width: "31.25rem",
          }}
        />
        <div
          style={{
            ...glowStyle,
            background: "var(--sky-300)",
            bottom: "-12.5rem",
            height: "21.875rem",
            left: "-9.375rem",
            width: "21.875rem",
          }}
        />
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "var(--space-10) var(--space-4)",
        }}
      >
        <main style={{ maxWidth: "26.25rem", width: "100%" }}>
          <Outlet />
        </main>
        <footer
          style={{
            color: "var(--color-text-muted)",
            display: "flex",
            flexWrap: "wrap",
            fontSize: "var(--font-size-3xs)",
            gap: "var(--space-4)",
            justifyContent: "center",
            marginTop: "var(--space-10)",
          }}
        >
          {footerLinks.map(footerLink => (
            <Anchor
              key={footerLink.link}
              style={{ color: "var(--color-text-muted)", fontWeight: 300 }}
              to={footerLink.link}
            >
              {footerLink.label}
            </Anchor>
          ))}
        </footer>
      </div>
    </>
  );
}
