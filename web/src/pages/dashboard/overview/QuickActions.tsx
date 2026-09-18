import type { LucideIcon } from "lucide-react";
import { SimpleGrid } from "@mantine/core";
import { ArrowUpIcon, CloudIcon, FolderPlusIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router";

import { Panel } from "@/components/panel/Panel";
import { paths } from "@/config/paths";

import styles from "./QuickActions.module.css";

type QuickAction = {
  color: string;
  icon: LucideIcon;
  label: string;
  to: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { color: "var(--sky-200)", icon: PlusIcon, label: "Register Model", to: paths.dashboard.models.path },
  { color: "var(--color-success)", icon: ArrowUpIcon, label: "Push Version", to: paths.dashboard.models.path },
  { color: "var(--color-purple)", icon: CloudIcon, label: "Add Storage", to: paths.dashboard.storage.path },
  { color: "var(--color-warning)", icon: FolderPlusIcon, label: "New Project", to: paths.dashboard.projects.path },
];

export function QuickActions() {
  return (
    <Panel>
      <Panel.Body>
        <div
          style={{
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-regular)",
            marginBottom: "var(--space-4)",
          }}
        >
          Quick Actions
        </div>
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing={10}>
          {QUICK_ACTIONS.map(action => (
            <Link className={styles.item} key={action.label} to={action.to}>
              <span
                style={{
                  alignItems: "center",
                  background: "color-mix(in srgb, currentColor 10%, transparent)",
                  borderRadius: "var(--radius-md)",
                  color: action.color,
                  display: "flex",
                  flexShrink: 0,
                  height: 32,
                  justifyContent: "center",
                  width: 32,
                }}
              >
                <action.icon size={15} />
              </span>
              <span style={{ fontSize: "var(--font-size-2xs)", fontWeight: "var(--font-regular)" }}>
                {action.label}
              </span>
            </Link>
          ))}
        </SimpleGrid>
      </Panel.Body>
    </Panel>
  );
}
