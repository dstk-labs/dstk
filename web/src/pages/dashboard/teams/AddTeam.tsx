import type { CreateTeamMutationVariables } from "@/graphql/types";
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

const CREATE_TEAM = gql(`
  mutation CreateTeam($data: TeamInput!) {
    createTeam(data: $data) {
      name
      teamId
    }
  }
`);

const createTeamSchema = z.object({
  description: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
}) satisfies z.ZodType<CreateTeamMutationVariables["data"]>;

type CreateTeamSchema = z.infer<typeof createTeamSchema>;

export function AddTeam() {
  const { setSelectedTeam } = useTeamStore();

  const [createTeam, { loading }] = useMutation(CREATE_TEAM);

  const [opened, { close, open }] = useDisclosure(false);

  const createTeamForm = useForm({
    initialValues: {
      description: "",
      name: "",
    },
    mode: "uncontrolled",
    validate: zod4Resolver(createTeamSchema),
  });

  const onSubmit = (values: CreateTeamSchema) =>
    createTeam({
      onCompleted: (data) => {
        if (data.createTeam?.teamId) {
          setSelectedTeam(data.createTeam.teamId);
        }
        notifications.show({
          color: "green",
          message: `Created ${data.createTeam?.name} and switched to it`,
          title: "Team created",
        });
        createTeamForm.reset();
        close();
      },
      refetchQueries: ["ListTeamsForDropdown", "ListTeamsForTable"],
      variables: {
        data: {
          description: values.description,
          name: values.name,
        },
      },
    });

  return (
    <>
      <Modal disabled={loading} onClose={close} opened={opened} title="New Team">
        <form onSubmit={createTeamForm.onSubmit(values => onSubmit(values))}>
          <Stack gap="lg">
            <TextInput
              data-autofocus
              disabled={loading}
              key={createTeamForm.key("name")}
              label="Team Name"
              placeholder="e.g. Acme ML"
              withAsterisk
              {...createTeamForm.getInputProps("name")}
            />
            <Textarea
              autosize
              disabled={loading}
              key={createTeamForm.key("description")}
              label="Description"
              minRows={3}
              placeholder="Who is this team for?"
              withAsterisk
              {...createTeamForm.getInputProps("description")}
            />
          </Stack>
          <ModalFooter loading={loading} onCancel={close} submitLabel="Create team" />
        </form>
      </Modal>

      <Button leftSection={<PlusIcon size={14} />} onClick={open} size="sm">
        New team
      </Button>
    </>
  );
}
