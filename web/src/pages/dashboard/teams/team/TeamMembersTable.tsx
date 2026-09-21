import type { GetTeamQuery } from "@/graphql/types";
import { Table } from "@mantine/core";
import { UsersRoundIcon } from "lucide-react";

import { DateCell } from "@/components/dateCell/DateCell";
import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { InitialsAvatar } from "@/components/initialsAvatar/InitialsAvatar";
import { StatusBadge } from "@/components/statusBadge/StatusBadge";
import { TableCard } from "@/components/tableCard/TableCard";

type Member = NonNullable<NonNullable<GetTeamQuery["listTeamMembers"]>[number]>;

type TeamMembersTableProps = {
  members: Member[];
};

export function TeamMembersTable({ members }: TeamMembersTableProps) {
  return (
    <TableCard>
      <TableCard.Toolbar
        start={(
          <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-regular)" }}>
            Members
          </span>
        )}
      />
      <TableCard.Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Added</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {members.length === 0 && (
            <EmptyTableRow
              colSpan={4}
              icon={<UsersRoundIcon size={24} />}
              title="No members"
            />
          )}
          {members.map(member => (
            <Table.Tr key={member.memberId}>
              <Table.Td>
                <div style={{ alignItems: "center", display: "flex", gap: "var(--space-2)" }}>
                  <InitialsAvatar name={member.user?.realName ?? ""} size={24} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span>{member.user?.realName ?? "—"}</span>
                    <span
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "var(--font-size-3xs)",
                        fontWeight: "var(--font-light)",
                      }}
                    >
                      @
                      {member.user?.userName}
                    </span>
                  </div>
                </div>
              </Table.Td>
              <Table.Td>
                <StatusBadge tone="sky">{member.role}</StatusBadge>
              </Table.Td>
              <Table.Td>{member.user?.email ?? "—"}</Table.Td>
              <Table.Td>
                <DateCell value={member.dateCreated} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </TableCard.Table>
    </TableCard>
  );
}
