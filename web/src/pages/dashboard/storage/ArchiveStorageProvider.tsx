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
  const [inputValue, setInputValue] = useState("");

  const [archiveStorageProvider, { loading }] = useMutation(
    ARCHIVE_STORAGE_PROVIDER,
  );

  const [opened, { close, open }] = useDisclosure(false);

  const onSubmit = () =>
    archiveStorageProvider({
      onCompleted: (data) => {
        notifications.show({
          message: `Successfully archived ${data.archiveStorageProvider?.bucket}`,
          title: "Success",
        });
        close();
        setInputValue("");
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
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size="lg"
        title={`Archive ${bucket}`}
      >
        <Stack gap="md">
          <Text size="sm">
            This action is
            {" "}
            <Text c="red" fw={500} span>
              irreversible
            </Text>
            . Archiving this bucket will permanently prevent any further
            addition of resources.
          </Text>
          <TextInput
            label="Please type in the name of the bucket to continue"
            onChange={e => setInputValue(e.target.value)}
            placeholder={bucket}
            value={inputValue}
          />
          <Button
            color="red"
            disabled={inputValue !== bucket || loading}
            fullWidth
            loading={loading}
            mt="sm"
            onClick={() => onSubmit()}
            radius="md"
          >
            I understand, archive this bucket
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
