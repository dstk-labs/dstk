import { useMutation } from "@apollo/client";
import {
  ActionIcon,
  Button,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ArchiveIcon } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/modal/Modal";
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
  const [inputValue, setInputValue] = useState("");

  const [archiveModelVersion, { loading }] = useMutation(ARCHIVE_MODEL_VERSION);

  const [opened, { close, open }] = useDisclosure(false);

  const onSubmit = () => {
    archiveModelVersion({
      onCompleted: (data) => {
        notifications.show({
          message: `Successfully archived version ${data.archiveModelVersion?.numericVersion} for model ${data.archiveModelVersion?.modelId?.modelName}`,
          title: "Success",
        });
        close();
        setInputValue("");
      },
      refetchQueries: ["ListMLModels", "ListMLModelVersions"],
      variables: {
        modelVersionId,
      },
    });
  };

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size="lg"
        title={`Archive Version ${numericVersion}`}
      >
        <Stack gap="md">
          <Text size="sm">
            This action is
            {" "}
            <Text c="red" fw={500} span>
              irreversible
            </Text>
            . Archiving this version will permanently prevent any further
            modifications and artifact uploads.
          </Text>
          <TextInput
            label="Please type in the name of the model version to continue"
            onChange={e => setInputValue(e.target.value)}
            placeholder={`Version ${numericVersion}`}
            value={inputValue}
          />
          <Button
            color="red"
            disabled={inputValue !== `Version ${numericVersion}` || loading}
            fullWidth
            loading={loading}
            mt="sm"
            onClick={() => onSubmit()}
            radius="md"
          >
            I understand, archive this version
          </Button>
        </Stack>
      </Modal>

      <Tooltip disabled={isArchived} label="Archive">
        <ActionIcon
          color="red"
          disabled={isArchived}
          onClick={open}
          variant="subtle"
        >
          <ArchiveIcon size={14} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
