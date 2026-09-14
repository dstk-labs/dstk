import { useMutation } from "@apollo/client";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ArchiveIcon } from "lucide-react";

import { ArchiveConfirmModal } from "@/components/archiveConfirmModal/ArchiveConfirmModal";
import { RowAction } from "@/components/rowActions/RowActions";
import { gql } from "@/graphql";

const ARCHIVE_PROJECT = gql(`
  mutation ArchiveProject($projectId: String!) {
    archiveProject(projectId: $projectId) {
      name
    }
  }
`);

type ArchiveProjectProps = {
  isArchived: boolean;
  projectId: string;
  projectName: string;
};

export function ArchiveProject({
  isArchived,
  projectId,
  projectName,
}: ArchiveProjectProps) {
  const [archiveProject, { loading }] = useMutation(ARCHIVE_PROJECT);

  const [opened, { close, open }] = useDisclosure(false);

  const onConfirm = () =>
    archiveProject({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Archived ${data.archiveProject?.name}`,
          title: "Project archived",
        });
        close();
      },
      refetchQueries: ["ListProjectsForTable", "ListProjectsForSelect"],
      variables: {
        projectId,
      },
    });

  return (
    <>
      <ArchiveConfirmModal
        confirmValue={projectName}
        consequence="Archiving this project prevents further changes and blocks new models from being added to it."
        entityLabel="project"
        loading={loading}
        onClose={close}
        onConfirm={onConfirm}
        opened={opened}
        title={`Archive ${projectName}`}
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
