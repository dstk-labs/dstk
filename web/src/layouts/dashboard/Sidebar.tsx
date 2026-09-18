import type { GetUserQuery } from "@/graphql/types";
import { Link } from "react-router";

import { BrandMark } from "@/components/brandMark/BrandMark";
import { paths } from "@/config/paths";

import { SidebarNav } from "./SidebarNav";
import { TeamSelect } from "./TeamSelect";
import { UserFooter } from "./UserFooter";

type SidebarProps = {
  onNavigate: () => void;
  user: NonNullable<GetUserQuery["getUser"]>;
};

export function Sidebar({ onNavigate, user }: SidebarProps) {
  return (
    <>
      <Link
        onClick={onNavigate}
        style={{
          alignItems: "center",
          borderBottom: "var(--border-width) solid var(--color-border-default)",
          color: "var(--color-text-primary)",
          display: "flex",
          flexShrink: 0,
          gap: 10,
          height: "var(--topbar-height)",
          padding: "0 var(--space-5)",
          textDecoration: "none",
        }}
        to={paths.dashboard.overview.path}
      >
        <BrandMark />
        <span style={{ fontSize: "var(--font-size-base)", fontWeight: "var(--font-regular)" }}>
          DSTK
        </span>
      </Link>

      <TeamSelect />

      <SidebarNav onNavigate={onNavigate} />

      <UserFooter user={user} />
    </>
  );
}
