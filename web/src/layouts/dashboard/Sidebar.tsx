import type { GetUserQuery } from "@/graphql/types";
import { Burger } from "@mantine/core";
import { Link } from "react-router";

import { BrandMark } from "@/components/brandMark/BrandMark";
import { paths } from "@/config/paths";

import { SidebarNav } from "./SidebarNav";
import { TeamSelect } from "./TeamSelect";
import { UserFooter } from "./UserFooter";

type SidebarProps = {
  onClose: () => void;
  user: NonNullable<GetUserQuery["user"]["get"]>;
};

export function Sidebar({ onClose, user }: SidebarProps) {
  return (
    <>
      <div
        style={{
          alignItems: "center",
          borderBottom: "var(--border-width) solid var(--color-border-default)",
          display: "flex",
          flexShrink: 0,
          height: "var(--topbar-height)",
          justifyContent: "space-between",
          padding: "0 var(--space-5)",
        }}
      >
        <Link
          onClick={onClose}
          style={{
            alignItems: "center",
            color: "var(--color-text-primary)",
            display: "flex",
            gap: 10,
            textDecoration: "none",
          }}
          to={paths.dashboard.overview.path}
        >
          <BrandMark />
          <span style={{ fontSize: "var(--font-size-base)", fontWeight: "var(--font-regular)" }}>
            DSTK
          </span>
        </Link>
        <Burger
          aria-label="Close navigation"
          hiddenFrom="md"
          onClick={onClose}
          opened
          size="sm"
        />
      </div>

      <TeamSelect />

      <SidebarNav onNavigate={onClose} />

      <UserFooter user={user} />
    </>
  );
}
