import { useMutation } from "@apollo/client";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ArchiveIcon } from "lucide-react";

import { ArchiveConfirmModal } from "@/components/archiveConfirmModal/ArchiveConfirmModal";
import { RowAction } from "@/components/rowActions/RowActions";
import { gql } from "@/graphql";

const ARCHIVE_STORAGE_PROVIDER = gql(`
  mutation ArchiveStorageProvider($providerId: String!) {
    archiveStorageProvider(providerId: $providerId) {
      bucket
    }
  }
`);

type ArchiveStorageProviderProps = {
  bucket: string;
  isArchived: boolean;
  providerId: string;
};

export function ArchiveStorageProvider({
  bucket,
  isArchived,
  providerId,
}: ArchiveStorageProviderProps) {
  const [archiveStorageProvider, { loading }] = useMutation(
    ARCHIVE_STORAGE_PROVIDER,
  );

  const [opened, { close, open }] = useDisclosure(false);

  const onConfirm = () =>
    archiveStorageProvider({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Archived ${data.archiveStorageProvider?.bucket}`,
          title: "Storage provider archived",
        });
        close();
      },
      refetchQueries: [
        "ListStorageProvidersForTable",
        "ListStorageProvidersForSelect",
      ],
      variables: {
        providerId,
      },
    });

  return (
    <>
      <ArchiveConfirmModal
        confirmValue={bucket}
        consequence="Archived providers can't be used for new models. Existing model versions remain accessible."
        entityLabel="bucket"
        loading={loading}
        onClose={close}
        onConfirm={onConfirm}
        opened={opened}
        title={`Archive ${bucket}`}
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
