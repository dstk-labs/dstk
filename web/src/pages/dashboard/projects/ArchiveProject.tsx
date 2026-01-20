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
  const [inputValue, setInputValue] = useState("");

  const [archiveProject, { loading }] = useMutation(ARCHIVE_PROJECT);

  const [opened, { close, open }] = useDisclosure(false);

  const onSubmit = () =>
    archiveProject({
      onCompleted: (data) => {
        notifications.show({
          message: `Successfully archived ${data.archiveProject?.name}`,
          title: "Success",
        });
        close();
        setInputValue("");
      },
      refetchQueries: ["ListProjectsForTable", "ListProjectsForSelect"],
      variables: {
        projectId,
      },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size="lg"
        title={`Archive ${projectName}`}
      >
        <Stack gap="md">
          <Text size="sm">
            This action is
            {" "}
            <Text c="red" fw={500} span>
              irreversible
            </Text>
            . Archiving this project will permanently prevent any further
            modifications or the addition of new models.
          </Text>
          <TextInput
            label="Please type in the name of the project to continue"
            onChange={e => setInputValue(e.target.value)}
            placeholder={projectName}
            value={inputValue}
          />
          <Button
            color="red"
            disabled={inputValue !== projectName || loading}
            fullWidth
            loading={loading}
            mt="sm"
            onClick={() => onSubmit()}
            radius="md"
          >
            I understand, archive this project
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
