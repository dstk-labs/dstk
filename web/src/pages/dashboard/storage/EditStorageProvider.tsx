import type { EditStorageProviderMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { PasswordInput, Stack, TextInput } from "@mantine/core";
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

const EDIT_STORAGE_PROVIDER = gql(`
  mutation EditStorageProvider($data: EditStorageProviderInput!) {
    editStorageProvider(data: $data) {
        bucket
    }
  }
`);

const editStorageProviderSchema = z.object({
  accessKeyId: z.string().min(1, "Required"),
  secretAccessKey: z.string().min(1, "Required"),
}) satisfies z.ZodType<
  Omit<EditStorageProviderMutationVariables["data"], "providerId">
>;

type EditStorageProviderProps = {
  bucket: string;
  isArchived: boolean;
  originalAccessKeyId: string;
  providerId: string;
};

type EditStorageProviderSchema = z.infer<typeof editStorageProviderSchema>;

export function EditStorageProvider({
  bucket,
  isArchived,
  originalAccessKeyId,
  providerId,
}: EditStorageProviderProps) {
  const [editStorageProvider, { loading }] = useMutation(EDIT_STORAGE_PROVIDER);

  const [opened, { close, open }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      accessKeyId: originalAccessKeyId,
      secretAccessKey: "",
    },
    mode: "uncontrolled",
    validate: zod4Resolver(editStorageProviderSchema),
  });

  const onSubmit = (values: EditStorageProviderSchema) =>
    editStorageProvider({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Rotated credentials for ${data.editStorageProvider?.bucket}`,
          title: "Credentials updated",
        });
        form.reset();
        close();
      },
      refetchQueries: [
        "ListStorageProvidersForTable",
        "ListStorageProvidersForSelect",
      ],
      variables: {
        data: {
          accessKeyId: values.accessKeyId,
          providerId,
          secretAccessKey: values.secretAccessKey,
        },
      },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        title={`Update credentials for ${bucket}`}
      >
        <form onSubmit={form.onSubmit(values => onSubmit(values))}>
          <Stack gap="lg">
            <TextInput
              autoComplete="off"
              disabled={loading}
              key={form.key("accessKeyId")}
              label="Access Key ID"
              styles={{ input: { fontFamily: "var(--font-mono)" } }}
              withAsterisk
              {...form.getInputProps("accessKeyId")}
            />
            <PasswordInput
              autoComplete="new-password"
              description="Enter the new secret. The current secret is never shown."
              disabled={loading}
              key={form.key("secretAccessKey")}
              label="Secret Access Key"
              withAsterisk
              {...form.getInputProps("secretAccessKey")}
            />
          </Stack>
          <ModalFooter loading={loading} onCancel={close} submitLabel="Save credentials" />
        </form>
      </Modal>

      <RowAction
        disabled={isArchived}
        icon={<PencilIcon size={14} />}
        label="Update Credentials"
        onClick={open}
      />
    </>
  );
}
