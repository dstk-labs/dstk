import { useMutation } from "@apollo/client";
import { Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Trash2Icon } from "lucide-react";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { RowAction } from "@/components/rowActions/RowActions";
import { gql } from "@/graphql";

const ARCHIVE_API_KEY = gql(`
  mutation ArchiveApiKey($apiKeyId: String!) {
    archiveApiKey(apiKeyId: $apiKeyId) {
      apiKeyId
    }
  }
`);

type ArchiveApiKeyProps = {
  apiKeyId: string;
};

export function ArchiveApiKey({ apiKeyId }: ArchiveApiKeyProps) {
  const [archiveApiKey, { loading }] = useMutation(ARCHIVE_API_KEY);

  const [opened, { close, open }] = useDisclosure(false);

  const onConfirm = () =>
    archiveApiKey({
      onCompleted: () => {
        notifications.show({
          color: "green",
          message: "Requests using this key will now fail.",
          title: "API key revoked",
        });
        close();
      },
      refetchQueries: ["Settings"],
      variables: { apiKeyId },
    });

  return (
    <>
      <Modal disabled={loading} onClose={close} opened={opened} title="Revoke API Key">
        <Text c="var(--color-text-secondary)" fw={300} size="sm">
          This action is
          {" "}
          <Text c="var(--color-error)" fw={400} span>
            irreversible
          </Text>
          . Any CLI or SDK session using this key stops working immediately.
        </Text>
        <ModalFooter
          loading={loading}
          onCancel={close}
          onSubmit={onConfirm}
          submitLabel="Revoke key"
          tone="danger"
        />
      </Modal>

      <RowAction danger icon={<Trash2Icon size={14} />} label="Revoke" onClick={open} />
    </>
  );
}
