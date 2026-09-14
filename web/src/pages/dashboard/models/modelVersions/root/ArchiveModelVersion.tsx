import { useMutation } from "@apollo/client";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ArchiveIcon } from "lucide-react";

import { ArchiveConfirmModal } from "@/components/archiveConfirmModal/ArchiveConfirmModal";
import { RowAction } from "@/components/rowActions/RowActions";
import { gql } from "@/graphql";

const ARCHIVE_MODEL_VERSION = gql(`
  mutation ArchiveModelVersion($modelVersionId: String!) {
    archiveModelVersion(modelVersionId: $modelVersionId) {
      numericVersion
      modelId {
        modelName
      }
    }
  }
`);

type ArchiveModelVersionProps = {
  isArchived: boolean;
  modelVersionId: string;
  numericVersion: number;
};

export function ArchiveModelVersion({
  isArchived,
  modelVersionId,
  numericVersion,
}: ArchiveModelVersionProps) {
  const [archiveModelVersion, { loading }] = useMutation(ARCHIVE_MODEL_VERSION);

  const [opened, { close, open }] = useDisclosure(false);

  const onConfirm = () => {
    archiveModelVersion({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Archived v${data.archiveModelVersion?.numericVersion} of ${data.archiveModelVersion?.modelId?.modelName}`,
          title: "Version archived",
        });
        close();
      },
      refetchQueries: ["ListMLModels", "ListMLModelVersions", "GetMLModelVersion"],
      variables: {
        modelVersionId,
      },
    });
  };

  return (
    <>
      <ArchiveConfirmModal
        confirmValue={`v${numericVersion}`}
        consequence="Archiving this version prevents further changes and artifact uploads."
        entityLabel="version"
        loading={loading}
        onClose={close}
        onConfirm={onConfirm}
        opened={opened}
        title={`Archive v${numericVersion}`}
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
