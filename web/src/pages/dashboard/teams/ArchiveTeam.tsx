import { useMutation } from "@apollo/client";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ArchiveIcon } from "lucide-react";

import { ArchiveConfirmModal } from "@/components/archiveConfirmModal/ArchiveConfirmModal";
import { RowAction } from "@/components/rowActions/RowActions";
import { gql } from "@/graphql";

const ARCHIVE_TEAM = gql(`
  mutation ArchiveTeam($teamId: String!) {
    archiveTeam(teamId: $teamId) {
      name
    }
  }
`);

type ArchiveTeamProps = {
  isArchived: boolean;
  teamId: string;
  teamName: string;
};

export function ArchiveTeam({
  isArchived,
  teamId,
  teamName,
}: ArchiveTeamProps) {
  const [archiveTeam, { loading }] = useMutation(ARCHIVE_TEAM);

  const [opened, { close, open }] = useDisclosure(false);

  const onConfirm = () =>
    archiveTeam({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Archived ${data.archiveTeam?.name}`,
          title: "Team archived",
        });
        close();
      },
      refetchQueries: ["ListTeamsForDropdown", "ListTeamsForTable"],
      variables: {
        teamId,
      },
    });

  return (
    <>
      <ArchiveConfirmModal
        confirmValue={teamName}
        consequence="Archiving this team prevents further changes and blocks new resources from being added to it."
        entityLabel="team"
        loading={loading}
        onClose={close}
        onConfirm={onConfirm}
        opened={opened}
        title={`Archive ${teamName}`}
      />

      <RowAction
        danger
        disabled={isArchived}
        icon={<ArchiveIcon size={14} />}
        label="Archive"
        onClick={open}
      />
    </>
  );
}
