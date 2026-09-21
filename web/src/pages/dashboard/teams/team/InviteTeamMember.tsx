import type { InviteToTeamMutationVariables, UserRole } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { Button, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { UserPlusIcon } from "lucide-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { UsersSelect } from "@/features/users/components/UsersSelect";
import { gql } from "@/graphql";

const INVITE_TO_TEAM = gql(`
  mutation InviteToTeam($data: InviteTeamMemberInput!) {
    inviteToTeam(data: $data) {
      email
    }
  }
`);

const ROLES: { label: string; value: UserRole }[] = [
  { label: "Owner", value: "owner" },
  { label: "Member", value: "member" },
  { label: "Viewer", value: "viewer" },
];

const inviteTeamMemberSchema = z.object({
  role: z.enum(["owner", "member", "viewer"]),
  userId: z.string().min(1, "Required"),
}) satisfies z.ZodType<Omit<InviteToTeamMutationVariables["data"], "teamId">>;

type InviteTeamMemberSchema = z.infer<typeof inviteTeamMemberSchema>;

type InviteTeamMemberProps = {
  disabled: boolean;
  teamId: string;
};

export function InviteTeamMember({ disabled, teamId }: InviteTeamMemberProps) {
  const [inviteToTeam, { loading }] = useMutation(INVITE_TO_TEAM);

  const [opened, { close, open }] = useDisclosure(false);

  const form = useForm<InviteTeamMemberSchema>({
    initialValues: {
      role: "member",
      userId: "",
    },
    mode: "uncontrolled",
    validate: zod4Resolver(inviteTeamMemberSchema),
  });

  const onSubmit = (values: InviteTeamMemberSchema) =>
    inviteToTeam({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Invited ${data.inviteToTeam?.email}`,
          title: "Invitation sent",
        });
        form.reset();
        close();
      },
      refetchQueries: ["GetTeam"],
      variables: {
        data: {
          role: values.role,
          teamId,
          userId: values.userId,
        },
      },
    });

  return (
    <>
      <Modal disabled={loading} onClose={close} opened={opened} title="Invite to Team">
        <form onSubmit={form.onSubmit(values => onSubmit(values))}>
          <Stack gap="lg">
            <UsersSelect
              data-autofocus
              disabled={loading}
              key={form.key("userId")}
              label="User"
              withAsterisk
              {...form.getInputProps("userId")}
            />
            <Select
              allowDeselect={false}
              data={ROLES}
              disabled={loading}
              key={form.key("role")}
              label="Role"
              withAsterisk
              {...form.getInputProps("role")}
            />
          </Stack>
          <ModalFooter loading={loading} onCancel={close} submitLabel="Send invitation" />
        </form>
      </Modal>

      <Button
        disabled={disabled}
        leftSection={<UserPlusIcon size={14} />}
        onClick={open}
        size="sm"
      >
        Invite member
      </Button>
    </>
  );
}
