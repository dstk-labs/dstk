import { useMutation } from "@apollo/client";
import { Button, Stack, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { cloneElement, useState } from "react";

import { Modal } from "@/components/modal/Modal";
import { gql } from "@/graphql";

import { GET_ML_MODEL } from "../loaders/modelLoader";

const ARCHIVE_MODEL = gql(`
  mutation ArchiveModel($modelId: String!) {
    archiveModel(modelId: $modelId) {
      modelName
    }
  }
`);

type ArchiveModelProps = {
  isArchived: boolean;
  modelId: string;
  modelName: string;
  trigger: React.ReactElement<{ disabled?: boolean; onClick?: () => void }>;
};

export function ArchiveModel({
  isArchived,
  modelId,
  modelName,
  trigger,
}: ArchiveModelProps) {
  const [inputValue, setInputValue] = useState("");

  const [archiveModel, { loading }] = useMutation(ARCHIVE_MODEL);

  const [opened, { close, open }] = useDisclosure(false);

  const onSubmit = () =>
    archiveModel({
      onCompleted: (data) => {
        notifications.show({
          message: `Successfully archived ${data.archiveModel?.modelName}`,
          title: "Success",
        });
        close();
        setInputValue("");
      },
      refetchQueries: [
        "ListMLModels",
        {
          query: GET_ML_MODEL,
          variables: {
            modelId,
          },
        },
      ],
      variables: {
        modelId,
      },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size="lg"
        title={`Archive ${modelName}`}
      >
        <Stack gap="md">
          <Text size="sm">
            This action is
            {" "}
            <Text c="red" fw={500} span>
              irreversible
            </Text>
            . Archiving this model will permanently prevent any further
            modifications and deployments.
          </Text>
          <TextInput
            label="Please type in the name of the model to continue"
            onChange={e => setInputValue(e.target.value)}
            placeholder={modelName}
            value={inputValue}
          />
          <Button
            color="red"
            disabled={inputValue !== modelName || loading}
            fullWidth
            loading={loading}
            mt="sm"
            onClick={() => onSubmit()}
            radius="md"
          >
            I understand, archive this model
          </Button>
        </Stack>
      </Modal>
      {cloneElement(trigger, {
        disabled: isArchived || trigger.props.disabled,
        onClick: open,
      })}
    </>
  );
}
