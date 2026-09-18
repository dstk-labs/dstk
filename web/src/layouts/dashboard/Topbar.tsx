import { Burger, UnstyledButton } from "@mantine/core";
import { BookOpenIcon, SearchIcon } from "lucide-react";

import { DiscordIcon } from "@/components/icons/discord/DiscordIcon";
import { GithubIcon } from "@/components/icons/github/GitHubIcon";

import styles from "./Topbar.module.css";

type TopbarProps = {
  onToggleSidebar: () => void;
  sidebarOpened: boolean;
};

const EXTERNAL_LINKS = [
  { href: "https://github.com/dstk-labs", icon: <BookOpenIcon size={16} />, label: "Docs" },
  { href: "https://github.com/dstk-labs", icon: <GithubIcon height={16} width={16} />, label: "GitHub" },
  { href: "https://discord.com", icon: <DiscordIcon height={16} width={16} />, label: "Discord" },
];

export function Topbar({ onToggleSidebar, sidebarOpened }: TopbarProps) {
  return (
    <div className={styles.topbar}>
      <div style={{ alignItems: "center", display: "flex", flex: 1, gap: "var(--space-3)" }}>
        <Burger
          hiddenFrom="md"
          onClick={onToggleSidebar}
          opened={sidebarOpened}
          size="sm"
        />
        <UnstyledButton className={styles.search}>
          <SearchIcon size={14} style={{ opacity: 0.5 }} />
          Search models, projects…
          <kbd className={styles.kbd}>⌘K</kbd>
        </UnstyledButton>
      </div>
      <div style={{ alignItems: "center", display: "flex", gap: 4 }}>
        {EXTERNAL_LINKS.map(link => (
          <a
            className={styles.link}
            href={link.href}
            key={link.label}
            rel="noopener noreferrer"
            target="_blank"
          >
            {link.icon}
            <span className={styles.linkLabel}>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
