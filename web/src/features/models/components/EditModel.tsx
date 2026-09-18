import type { EditModelMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { Group, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { cloneElement } from "react";
import { useNavigate } from "react-router";
import { z } from "zod/v4";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { GET_ML_MODEL } from "@/features/models/loaders/modelLoader";
import { ProjectsSelect } from "@/features/projects/components/ProjectsSelect";
import { StorageProviderSelect } from "@/features/storage/components/StorageProviderSelect";
import { gql } from "@/graphql";
import { apolloClient } from "@/lib/apollo";

import { LIST_MODELS } from "../loaders/modelsLoader";

const EDIT_MODEL = gql(`
  mutation EditModel($data: ModelInput!, $modelId: String!) {
    editModel(data: $data, modelId: $modelId) {
      modelName
  }
}
`);

const editModelSchema = z.object({
  description: z.string().min(1, "Required"),
  modelName: z.string().min(1, "Required"),
  projectId: z.string().min(1, "Required"),
  storageProviderId: z.string().min(1, "Required"),
}) satisfies z.ZodType<Omit<EditModelMutationVariables["data"], "modelId">>;

type EditModelProps = {
  isArchived: boolean;
  modelId: string;
  originalDescription: string;
  originalModelName: string;
  originalProjectId: string;
  originalStorageProviderId: string;
  trigger: React.ReactElement<{ disabled?: boolean; onClick?: () => void }>;
};

type EditModelSchema = z.infer<typeof editModelSchema>;

export function EditModel({
  isArchived,
  modelId,
  originalDescription,
  originalModelName,
  originalProjectId,
  originalStorageProviderId,
  trigger,
}: EditModelProps) {
  const navigate = useNavigate();

  const [editModel, { loading }] = useMutation(EDIT_MODEL);

  const [opened, { close, open }] = useDisclosure(false);

  const editModelForm = useForm({
    initialValues: {
      description: originalDescription,
      modelName: originalModelName,
      projectId: originalProjectId,
      storageProviderId: originalStorageProviderId,
    },
    mode: "uncontrolled",
    validate: zod4Resolver(editModelSchema),
  });

  const onSubmit = (values: EditModelSchema) =>
    editModel({
      onCompleted: async (data) => {
        editModelForm.reset();
        notifications.show({
          color: "green",
          message: `Saved changes to ${data.editModel?.modelName}`,
          title: "Model updated",
        });
        close();

        // Breadcrumb labels read from the Apollo cache, so refetch before
        // re-navigating to force the route handle to re-run.
        await apolloClient.refetchQueries({
          include: [LIST_MODELS, GET_ML_MODEL],
        });
        navigate(location.pathname, { replace: true });
      },
      variables: {
        data: { ...values },
        modelId,
      },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        title={`Edit ${originalModelName}`}
      >
        <form onSubmit={editModelForm.onSubmit(values => onSubmit(values))}>
          <Stack gap="lg">
            <TextInput
              disabled={loading}
              key={editModelForm.key("modelName")}
              label="Model Name"
              styles={{ input: { fontFamily: "var(--font-mono)" } }}
              withAsterisk
              {...editModelForm.getInputProps("modelName")}
            />
            <Group align="flex-start" grow>
              <ProjectsSelect
                disabled={loading}
                key={editModelForm.key("projectId")}
                withAsterisk
                {...editModelForm.getInputProps("projectId")}
              />
              <StorageProviderSelect
                disabled={loading}
                key={editModelForm.key("storageProviderId")}
                withAsterisk
                {...editModelForm.getInputProps("storageProviderId")}
              />
            </Group>
            <Textarea
              autosize
              disabled={loading}
              key={editModelForm.key("description")}
              label="Description"
              minRows={3}
              withAsterisk
              {...editModelForm.getInputProps("description")}
            />
          </Stack>
          <ModalFooter loading={loading} onCancel={close} submitLabel="Save changes" />
        </form>
      </Modal>
      {cloneElement(trigger, {
        disabled: isArchived || trigger.props.disabled,
        onClick: open,
      })}
    </>
  );
}
