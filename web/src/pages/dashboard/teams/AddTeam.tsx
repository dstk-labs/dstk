import type { CreateTeamMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { Button, Flex, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { zod4Resolver } from "mantine-form-zod-resolver";

import { z } from "zod/v4";

import { Modal } from "@/components/modal/Modal";
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
          setSelectedTeam(data.createTeam?.teamId);
        }
        notifications.show({
          message: `Successfully created ${data.createTeam?.name}`,
          title: "Success",
        });
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
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size="lg"
        title="Add Team"
      >
        <form onSubmit={createTeamForm.onSubmit(values => onSubmit(values))}>
          <Stack gap="md">
            <TextInput
              disabled={loading}
              key={createTeamForm.key("name")}
              label="Team Name"
              withAsterisk
              {...createTeamForm.getInputProps("name")}
            />

            <Textarea
              disabled={loading}
              key={createTeamForm.key("description")}
              label="Description"
              withAsterisk
              {...createTeamForm.getInputProps("description")}
            />
          </Stack>

          <Flex align="center" justify="end" mt="xl">
            <Button color="blue" loading={loading} radius="md" type="submit">
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>

      <Button fullWidth onClick={open}>
        Add Team
      </Button>
    </>
  );
}
