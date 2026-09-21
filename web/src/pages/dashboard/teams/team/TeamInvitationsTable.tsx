import type { GetTeamQuery } from "@/graphql/types";
import { Table } from "@mantine/core";
import { MailIcon } from "lucide-react";

import { DateCell } from "@/components/dateCell/DateCell";
import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { RowActions } from "@/components/rowActions/RowActions";
import { StatusBadge } from "@/components/statusBadge/StatusBadge";
import { TableCard } from "@/components/tableCard/TableCard";

import { CancelInvitation } from "./CancelInvitation";

type Invitation = NonNullable<
  NonNullable<NonNullable<GetTeamQuery["listInvitations"]>["edges"]>[number]["node"]
>;

type TeamInvitationsTableProps = {
  invitations: Invitation[];
  teamId: string;
};

export function TeamInvitationsTable({ invitations, teamId }: TeamInvitationsTableProps) {
  return (
    <TableCard>
      <TableCard.Toolbar
        start={(
          <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-regular)" }}>
            Pending Invitations
          </span>
        )}
      />
      <TableCard.Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Email</Table.Th>
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
              description="Invite someone and they will show up here until they respond."
              icon={<MailIcon size={24} />}
              title="No pending invitations"
            />
          )}
          {invitations.map(invitation => (
            <Table.Tr key={invitation.id}>
              <Table.Td>{invitation.email}</Table.Td>
              <Table.Td>
                <StatusBadge tone="sky">{invitation.role}</StatusBadge>
              </Table.Td>
              <Table.Td>{invitation.inviter?.realName ?? "—"}</Table.Td>
              <Table.Td>
                <DateCell value={invitation.expiresAt} />
              </Table.Td>
              <Table.Td>
                <RowActions>
                  <CancelInvitation
                    email={invitation.email ?? ""}
                    invitationId={invitation.id ?? ""}
                    teamId={teamId}
                  />
                </RowActions>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </TableCard.Table>
    </TableCard>
  );
}
