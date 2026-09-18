import type { GetUserQuery } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { Menu } from "@mantine/core";
import { EllipsisIcon, LogOutIcon } from "lucide-react";

import { InitialsAvatar } from "@/components/initialsAvatar/InitialsAvatar";
import { GET_USER } from "@/features/auth/loaders/authLoader";
import { gql } from "@/graphql";

import styles from "./Sidebar.module.css";

const LOGOUT = gql(`
  mutation Logout {
    logout
  }
`);

type UserFooterProps = {
  user: NonNullable<GetUserQuery["getUser"]>;
};

export function UserFooter({ user }: UserFooterProps) {
  const [logout, { loading }] = useMutation(LOGOUT);

  const displayName = user.realName ?? user.userName ?? "Account";

  return (
    <div
      style={{
        alignItems: "center",
        borderTop: "var(--border-width) solid var(--color-border-muted)",
        display: "flex",
        gap: 10,
        padding: "var(--space-4) var(--space-5)",
      }}
    >
      <InitialsAvatar name={displayName} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "var(--font-size-xs)",
            fontWeight: "var(--font-regular)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {displayName}
        </div>
        <div
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--font-size-4xs)",
            fontWeight: "var(--font-light)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.email}
        </div>
      </div>
      <Menu position="top-end" width={200}>
        <Menu.Target>
          <button aria-label="Account menu" className={styles.footerBtn} type="button">
            <EllipsisIcon size={16} />
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{user.userName}</Menu.Label>
          <Menu.Item
            disabled={loading}
            leftSection={<LogOutIcon size={14} />}
            onClick={() => logout({ refetchQueries: [{ query: GET_USER }] })}
          >
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
