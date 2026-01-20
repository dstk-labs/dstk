import type { CreateModelMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { Button, Flex, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { zod4Resolver } from "mantine-form-zod-resolver";

import { z } from "zod/v4";
import { Modal } from "@/components/modal/Modal";
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
          message: `Successfully created ${data.createModel?.modelName}`,
          title: "Success",
        });
        close();
      },
      refetchQueries: ["ListMLModels"],
      variables: {
        data: {
          description: values.description,
          modelName: values.modelName,
          projectId: values.projectId,
          storageProviderId: values.storageProviderId,
        },
      },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size="lg"
        title="Add Model"
      >
        <form onSubmit={createModelForm.onSubmit(values => onSubmit(values))}>
          <Stack gap="md">
            <TextInput
              disabled={loading}
              key={createModelForm.key("modelName")}
              label="Model Name"
              withAsterisk
              {...createModelForm.getInputProps("modelName")}
            />

            {/* TODO: Stack on sm */}
            <Group grow>
              <StorageProviderSelect
                disabled={loading}
                key={createModelForm.key("storageProviderId")}
                withAsterisk
                {...createModelForm.getInputProps("storageProviderId")}
              />
              <ProjectsSelect
                disabled={loading}
                key={createModelForm.key("projectId")}
                withAsterisk
                {...createModelForm.getInputProps("projectId")}
              />
            </Group>

            <Textarea
              disabled={loading}
              key={createModelForm.key("description")}
              label="Description"
              rows={4}
              withAsterisk
              {...createModelForm.getInputProps("description")}
            />
          </Stack>

          <Flex align="center" justify="end" mt="xl">
            <Button color="blue" radius="md" type="submit">
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>

      <Button fullWidth onClick={open}>
        Add Model
      </Button>
    </>
  );
}
