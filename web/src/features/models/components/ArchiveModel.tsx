import { useMutation } from "@apollo/client";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { cloneElement } from "react";

import { ArchiveConfirmModal } from "@/components/archiveConfirmModal/ArchiveConfirmModal";
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
  const [archiveModel, { loading }] = useMutation(ARCHIVE_MODEL);

  const [opened, { close, open }] = useDisclosure(false);

  const onConfirm = () =>
    archiveModel({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Archived ${data.archiveModel?.modelName}`,
          title: "Model archived",
        });
        close();
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
      <ArchiveConfirmModal
        confirmValue={modelName}
        consequence="Archiving this model prevents further changes and new versions."
        entityLabel="model"
        loading={loading}
        onClose={close}
        onConfirm={onConfirm}
        opened={opened}
        title={`Archive ${modelName}`}
      />
      {cloneElement(trigger, {
        disabled: isArchived || trigger.props.disabled,
        onClick: open,
      })}
    </>
  );
}
