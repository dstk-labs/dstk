import type { LucideIcon } from "lucide-react";
import {
  BoxIcon,
  CloudIcon,
  FolderIcon,
  LayoutDashboardIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router";

import { paths } from "@/config/paths";

import styles from "./Sidebar.module.css";

type NavItem = {
  icon: LucideIcon;
  label: string;
  to: string;
};

type NavSection = {
  items: NavItem[];
  label: string;
};

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { icon: LayoutDashboardIcon, label: "Overview", to: paths.dashboard.overview.path },
      { icon: FolderIcon, label: "Projects", to: paths.dashboard.projects.path },
      { icon: BoxIcon, label: "Models", to: paths.dashboard.models.path },
      { icon: CloudIcon, label: "Storage Providers", to: paths.dashboard.storage.path },
    ],
    label: "Main",
  },
  {
    items: [
      { icon: UsersRoundIcon, label: "Teams", to: paths.dashboard.teams.path },
    ],
    label: "Team",
  },
];

type SidebarNavProps = {
  onNavigate: () => void;
};

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const { pathname } = useLocation();

  return (
    <nav style={{ flex: 1, padding: "var(--space-2) 0" }}>
      {NAV_SECTIONS.map((section, index) => (
        <div key={section.label}>
          {index > 0 && (
            <div
              style={{
                background: "var(--color-border-muted)",
                height: 1,
                margin: "var(--space-2) var(--space-5)",
              }}
            />
          )}
          <div style={{ marginBottom: "var(--space-1)", padding: "var(--space-1) var(--space-3)" }}>
            <div
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--font-size-4xs)",
                fontWeight: "var(--font-medium)",
                letterSpacing: "var(--tracking-caps-wide)",
                padding: "var(--space-2) var(--space-2) 6px",
                textTransform: "uppercase",
              }}
            >
              {section.label}
            </div>
            {section.items.map(item => (
              <Link
                className={styles.item}
                data-active={pathname.startsWith(item.to) || undefined}
                key={item.to}
                onClick={onNavigate}
                to={item.to}
              >
                <item.icon className={styles.itemIcon} size={15} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
