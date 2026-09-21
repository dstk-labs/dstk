import type { TeamLoader } from "@/features/teams/loaders/teamLoader";
import { useReadQuery } from "@apollo/client";
import { Stack } from "@mantine/core";
import { Suspense } from "react";
import { useLoaderData } from "react-router";

import { MetaItem, MetaList, MetaStrong } from "@/components/metaList/MetaList";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { ArchivableStatus, StatusBadge } from "@/components/statusBadge/StatusBadge";
import { useTeamStore } from "@/stores/teamStore";
import { formatDate } from "@/utils/formatters";

import { InviteTeamMember } from "./InviteTeamMember";
import { TeamInvitationsTable } from "./TeamInvitationsTable";
import { TeamMembersTable } from "./TeamMembersTable";

function TeamContent({ queryRef }: { queryRef: TeamLoader }) {
  const { data } = useReadQuery(queryRef);
  const { selectedTeam } = useTeamStore();

  const team = data.listTeams?.edges?.[0]?.node;
  const isArchived = !!team?.isArchived;

  const members = (data.listTeamMembers ?? [])
    .filter((member): member is NonNullable<typeof member> => Boolean(member));
  const invitations = (data.listInvitations?.edges ?? [])
    .map(edge => edge.node)
    .filter((invitation): invitation is NonNullable<typeof invitation> => Boolean(invitation));

  return (
    <>
      <PageHeader
        actions={<InviteTeamMember disabled={isArchived} teamId={team?.teamId ?? ""} />}
        badge={(
          <>
            <ArchivableStatus isArchived={isArchived} />
            {team?.teamId === selectedTeam && <StatusBadge tone="sky">Current</StatusBadge>}
          </>
        )}
        description={team?.description}
        meta={(
          <MetaList>
            <MetaItem>
              <MetaStrong>{members.length}</MetaStrong>
              {members.length === 1 ? "member" : "members"}
            </MetaItem>
            <MetaItem>
              Created
              {" "}
              {formatDate(team?.dateCreated)}
            </MetaItem>
          </MetaList>
        )}
        title={team?.name}
      />
      <Stack gap="xl">
        <TeamMembersTable members={members} />
        <TeamInvitationsTable invitations={invitations} teamId={team?.teamId ?? ""} />
      </Stack>
    </>
  );
}

export function TeamPage() {
  const queryRef = useLoaderData() as TeamLoader;

  return (
    <Suspense>
      <TeamContent queryRef={queryRef} />
    </Suspense>
  );
}
