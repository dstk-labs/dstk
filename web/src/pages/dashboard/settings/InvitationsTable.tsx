import type { SettingsQuery } from "@/graphql/types";
import { Table } from "@mantine/core";
import { MailIcon } from "lucide-react";

import { DateCell } from "@/components/dateCell/DateCell";
import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { StatusBadge } from "@/components/statusBadge/StatusBadge";
import { TableCard } from "@/components/tableCard/TableCard";

import { RespondToInvitation } from "./RespondToInvitation";

type Invitation = NonNullable<
  NonNullable<NonNullable<SettingsQuery["listInvitations"]>["edges"]>[number]["node"]
>;

type InvitationsTableProps = {
  invitations: Invitation[];
};

export function InvitationsTable({ invitations }: InvitationsTableProps) {
  return (
    <TableCard>
      <TableCard.Toolbar
        start={(
          <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-regular)" }}>
            Team Invitations
          </span>
        )}
      />
      <TableCard.Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Team</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Invited By</Table.Th>
            <Table.Th>Expires</Table.Th>
            <Table.Th aria-label="Actions" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {invitations.length === 0 && (
            <EmptyTableRow
              colSpan={5}
              description="Invitations from other teams will show up here."
              icon={<MailIcon size={24} />}
              title="No pending invitations"
            />
          )}
          {invitations.map(invitation => (
            <Table.Tr key={invitation.id}>
              <Table.Td>{invitation.teamId?.name ?? "—"}</Table.Td>
              <Table.Td>
                <StatusBadge tone="sky">{invitation.role}</StatusBadge>
              </Table.Td>
              <Table.Td>{invitation.inviter?.realName ?? "—"}</Table.Td>
              <Table.Td>
                <DateCell value={invitation.expiresAt} />
              </Table.Td>
              <Table.Td>
                <RespondToInvitation
                  invitationId={invitation.id ?? ""}
                  teamName={invitation.teamId?.name ?? ""}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </TableCard.Table>
    </TableCard>
  );
}
