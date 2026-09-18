import type { EditProjectMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { PencilIcon } from "lucide-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { RowAction } from "@/components/rowActions/RowActions";
import { gql } from "@/graphql";

const EDIT_PROJECT = gql(`
  mutation EditProject($data: EditProjectInput!) {
    editProject(data: $data) {
        name
    }
  }
`);

const editProjectSchema = z.object({
  description: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
}) satisfies z.ZodType<Omit<EditProjectMutationVariables["data"], "projectId">>;

type EditProjectProps = {
  isArchived: boolean;
  originalDescription: string;
  originalName: string;
  projectId: string;
};

type EditProjectSchema = z.infer<typeof editProjectSchema>;

export function EditProject({
  isArchived,
  originalDescription,
  originalName,
  projectId,
}: EditProjectProps) {
  const [editProject, { loading }] = useMutation(EDIT_PROJECT);

  const [opened, { close, open }] = useDisclosure(false);

  const editProjectForm = useForm({
    initialValues: {
      description: originalDescription,
      name: originalName,
    },
    mode: "uncontrolled",
    validate: zod4Resolver(editProjectSchema),
  });

  const onSubmit = (values: EditProjectSchema) =>
    editProject({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Saved changes to ${data.editProject?.name}`,
          title: "Project updated",
        });
        close();
      },
      refetchQueries: ["ListProjectsForTable", "ListProjectsForSelect"],
      variables: {
        data: {
          description: values.description,
          name: values.name,
          projectId,
        },
      },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        title={`Edit ${originalName}`}
      >
        <form onSubmit={editProjectForm.onSubmit(values => onSubmit(values))}>
          <Stack gap="lg">
            <TextInput
              disabled={loading}
              key={editProjectForm.key("name")}
              label="Project Name"
              withAsterisk
              {...editProjectForm.getInputProps("name")}
            />
            <Textarea
              autosize
              disabled={loading}
              key={editProjectForm.key("description")}
              label="Description"
              minRows={3}
              withAsterisk
              {...editProjectForm.getInputProps("description")}
            />
          </Stack>
          <ModalFooter loading={loading} onCancel={close} submitLabel="Save changes" />
        </form>
      </Modal>

      <RowAction
        disabled={isArchived}
        icon={<PencilIcon size={14} />}
        label="Edit"
        onClick={open}
      />
    </>
  );
}
