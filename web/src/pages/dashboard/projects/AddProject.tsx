import type { CreateProjectMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { Button, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { PlusIcon } from "lucide-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { gql } from "@/graphql";
import { useTeamStore } from "@/stores/teamStore";

const CREATE_PROJECT = gql(`
  mutation CreateProject($data: ProjectInput!) {
    createProject(data: $data) {
      name
    }
  }
`);

const createProjectSchema = z.object({
  description: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
}) satisfies z.ZodType<Omit<CreateProjectMutationVariables["data"], "teamId">>;

type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export function AddProject() {
  const { selectedTeam } = useTeamStore();

  const [createProject, { loading }] = useMutation(CREATE_PROJECT);

  const [opened, { close, open }] = useDisclosure(false);

  const createProjectForm = useForm({
    initialValues: {
      description: "",
      name: "",
    },
    mode: "uncontrolled",
    validate: zod4Resolver(createProjectSchema),
  });

  const onSubmit = (values: CreateProjectSchema) =>
    createProject({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Created ${data.createProject?.name}`,
          title: "Project created",
        });
        createProjectForm.reset();
        close();
      },
      refetchQueries: ["ListProjectsForTable", "ListProjectsForSelect"],
      variables: {
        data: {
          description: values.description,
          name: values.name,
          teamId: selectedTeam!,
        },
      },
    });

  return (
    <>
      <Modal disabled={loading} onClose={close} opened={opened} title="New Project">
        <form onSubmit={createProjectForm.onSubmit(values => onSubmit(values))}>
          <Stack gap="lg">
            <TextInput
              data-autofocus
              disabled={loading}
              key={createProjectForm.key("name")}
              label="Project Name"
              placeholder="e.g. Fraud detection"
              withAsterisk
              {...createProjectForm.getInputProps("name")}
            />
            <Textarea
              autosize
              disabled={loading}
              key={createProjectForm.key("description")}
              label="Description"
              minRows={3}
              placeholder="What does this project group together?"
              withAsterisk
              {...createProjectForm.getInputProps("description")}
            />
          </Stack>
          <ModalFooter loading={loading} onCancel={close} submitLabel="Create project" />
        </form>
      </Modal>

      <Button leftSection={<PlusIcon size={14} />} onClick={open} size="sm">
        New project
      </Button>
    </>
  );
}
