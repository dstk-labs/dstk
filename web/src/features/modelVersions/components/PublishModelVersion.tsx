import { useMutation } from "@apollo/client";
import { Button, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { CheckIcon } from "lucide-react";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { gql } from "@/graphql";

import { GET_ML_MODEL_VERSION } from "../loaders/modelVersionLoader";

const PUBLISH_MODEL_VERSION = gql(`
  mutation PublishModelVersion($modelVersionId: String!) {
    publishModelVersion(modelVersionId: $modelVersionId) {
      numericVersion
      isFinalized
    }
  }
`);

type PublishModelVersionProps = {
  isArchived: boolean;
  isFinalized: boolean;
  modelVersionId: string;
  numericVersion: number;
};

export function PublishModelVersion({
  isArchived,
  isFinalized,
  modelVersionId,
  numericVersion,
}: PublishModelVersionProps) {
  const [publishModelVersion, { loading }] = useMutation(PUBLISH_MODEL_VERSION);

  const [opened, { close, open }] = useDisclosure(false);

  const onConfirm = () =>
    publishModelVersion({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `v${data.publishModelVersion?.numericVersion} is now finalized`,
          title: "Version finalized",
        });
        close();
      },
      refetchQueries: [
        "ListMLModelVersions",
        { query: GET_ML_MODEL_VERSION, variables: { modelVersionId } },
      ],
      variables: { modelVersionId },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        title={`Finalize v${numericVersion}`}
      >
        <Stack gap="md">
          <Text c="var(--color-text-secondary)" fw={300} size="sm">
            Finalizing is
            {" "}
            <Text c="var(--color-warning)" fw={400} span>
              permanent
            </Text>
            . Artifacts and metadata for this version become read-only.
          </Text>
        </Stack>
        <ModalFooter
          loading={loading}
          onCancel={close}
          onSubmit={onConfirm}
          submitLabel="Finalize version"
        />
      </Modal>

      <Button
        disabled={isArchived || isFinalized}
        leftSection={<CheckIcon size={14} />}
        onClick={open}
        size="sm"
      >
        Finalize
      </Button>
    </>
  );
}
