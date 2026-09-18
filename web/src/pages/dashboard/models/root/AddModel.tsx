import type { CreateModelMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { Button, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { PlusIcon } from "lucide-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { ProjectsSelect } from "@/features/projects/components/ProjectsSelect";
import { StorageProviderSelect } from "@/features/storage/components/StorageProviderSelect";
import { gql } from "@/graphql";

const CREATE_MODEL = gql(`
  mutation CreateModel($data: ModelInput!) {
    createModel(data: $data) {
      modelName
    }
  }
`);

const createModelSchema = z.object({
  description: z.string().min(1, "Required"),
  modelName: z.string().min(1, "Required"),
  projectId: z.string().min(1, "Required"),
  storageProviderId: z.string().min(1, "Required"),
}) satisfies z.ZodType<CreateModelMutationVariables["data"]>;

type CreateModelSchema = z.infer<typeof createModelSchema>;

export function AddModel() {
  const [createModel, { loading }] = useMutation(CREATE_MODEL);

  const [opened, { close, open }] = useDisclosure(false);

  const createModelForm = useForm({
    initialValues: {
      description: "",
      modelName: "",
      projectId: "",
      storageProviderId: "",
    },
    mode: "uncontrolled",
    validate: zod4Resolver(createModelSchema),
  });

  const onSubmit = (values: CreateModelSchema) =>
    createModel({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Registered ${data.createModel?.modelName}`,
          title: "Model registered",
        });
        createModelForm.reset();
        close();
      },
      refetchQueries: ["ListMLModels"],
      variables: {
        data: { ...values },
      },
    });

  return (
    <>
      <Modal disabled={loading} onClose={close} opened={opened} title="Register Model">
        <form onSubmit={createModelForm.onSubmit(values => onSubmit(values))}>
          <Stack gap="lg">
            <TextInput
              data-autofocus
              disabled={loading}
              key={createModelForm.key("modelName")}
              label="Model Name"
              placeholder="e.g. fraud-classifier"
              styles={{ input: { fontFamily: "var(--font-mono)" } }}
              withAsterisk
              {...createModelForm.getInputProps("modelName")}
            />
            <Group align="flex-start" grow>
              <ProjectsSelect
                disabled={loading}
                key={createModelForm.key("projectId")}
                withAsterisk
                {...createModelForm.getInputProps("projectId")}
              />
              <StorageProviderSelect
                disabled={loading}
                key={createModelForm.key("storageProviderId")}
                withAsterisk
                {...createModelForm.getInputProps("storageProviderId")}
              />
            </Group>
            <Textarea
              autosize
              disabled={loading}
              key={createModelForm.key("description")}
              label="Description"
              minRows={3}
              placeholder="What does this model do?"
              withAsterisk
              {...createModelForm.getInputProps("description")}
            />
          </Stack>
          <ModalFooter loading={loading} onCancel={close} submitLabel="Register model" />
        </form>
      </Modal>

      <Button leftSection={<PlusIcon size={14} />} onClick={open} size="sm">
        Register model
      </Button>
    </>
  );
}
