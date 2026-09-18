import type { EditTeamMutationVariables } from "@/graphql/types";
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

const EDIT_TEAM = gql(`
  mutation EditTeam($data: EditTeamInput!) {
    editTeam(data: $data) {
      name
    }
  }
`);

const editTeamSchema = z.object({
  description: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
}) satisfies z.ZodType<Omit<EditTeamMutationVariables["data"], "teamId">>;

type EditTeamInputProps = {
  isArchived: boolean;
  originalDescription: string;
  originalName: string;
  teamId: string;
};

type EditTeamSchema = z.infer<typeof editTeamSchema>;

export function EditTeam({
  isArchived,
  originalDescription,
  originalName,
  teamId,
}: EditTeamInputProps) {
  const [editTeam, { loading }] = useMutation(EDIT_TEAM);

  const [opened, { close, open }] = useDisclosure(false);

  const editTeamForm = useForm({
    initialValues: {
      description: originalDescription,
      name: originalName,
    },
    mode: "uncontrolled",
    validate: zod4Resolver(editTeamSchema),
  });

  const onSubmit = (values: EditTeamSchema) =>
    editTeam({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Saved changes to ${data.editTeam?.name}`,
          title: "Team updated",
        });
        close();
      },
      refetchQueries: ["ListTeamsForDropdown", "ListTeamsForTable"],
      variables: {
        data: {
          description: values.description,
          name: values.name,
          teamId,
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
        <form onSubmit={editTeamForm.onSubmit(values => onSubmit(values))}>
          <Stack gap="lg">
            <TextInput
              disabled={loading}
              key={editTeamForm.key("name")}
              label="Team Name"
              withAsterisk
              {...editTeamForm.getInputProps("name")}
            />
            <Textarea
              autosize
              disabled={loading}
              key={editTeamForm.key("description")}
              label="Description"
              minRows={3}
              withAsterisk
              {...editTeamForm.getInputProps("description")}
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
