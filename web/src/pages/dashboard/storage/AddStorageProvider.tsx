import type { CreateStorageProviderMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import {
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { PlusIcon } from "lucide-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

import { AwsRegionsSelect } from "@/components/awsRegionSelect/AwsRegionSelect";
import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { gql } from "@/graphql";
import { useTeamStore } from "@/stores/teamStore";

const CREATE_STORAGE_PROVIDER = gql(`
  mutation CreateStorageProvider($data: StorageProviderInput!) {
    createStorageProvider(data: $data) {
        bucket
    }
}`);

const createStorageProviderSchema = z.object({
  accessKeyId: z.string().min(1, "Required"),
  bucket: z.string().min(1, "Required"),
  endpointUrl: z.url("Enter a valid URL"),
  region: z.string().min(1, "Required"),
  secretAccessKey: z.string().min(1, "Required"),
}) satisfies z.ZodType<
  Omit<CreateStorageProviderMutationVariables["data"], "teamId">
>;

type CreateStorageProviderSchema = z.infer<typeof createStorageProviderSchema>;

export function AddStorageProvider() {
  const { selectedTeam } = useTeamStore();

  const [createStorageProvider, { loading }] = useMutation(
    CREATE_STORAGE_PROVIDER,
  );

  const [opened, { close, open }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      accessKeyId: "",
      bucket: "",
      endpointUrl: "",
      region: "",
      secretAccessKey: "",
    },
    mode: "uncontrolled",
    validate: zod4Resolver(createStorageProviderSchema),
  });

  const onSubmit = (values: CreateStorageProviderSchema) =>
    createStorageProvider({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Connected ${data.createStorageProvider?.bucket}`,
          title: "Storage provider added",
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
          ...values,
          teamId: selectedTeam!,
        },
      },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        title="Add Storage Provider"
      >
        <form onSubmit={form.onSubmit(values => onSubmit(values))}>
          <Stack gap="lg">
            <TextInput
              data-autofocus
              disabled={loading}
              key={form.key("bucket")}
              label="Bucket"
              placeholder="my-models-bucket"
              styles={{ input: { fontFamily: "var(--font-mono)" } }}
              withAsterisk
              {...form.getInputProps("bucket")}
            />
            <TextInput
              description="Any S3-compatible endpoint: AWS S3, MinIO, Cloudflare R2, and so on."
              disabled={loading}
              key={form.key("endpointUrl")}
              label="Endpoint URL"
              placeholder="https://s3.us-east-1.amazonaws.com"
              styles={{ input: { fontFamily: "var(--font-mono)" } }}
              withAsterisk
              {...form.getInputProps("endpointUrl")}
            />
            <AwsRegionsSelect
              disabled={loading}
              key={form.key("region")}
              withAsterisk
              {...form.getInputProps("region")}
            />
            <Group grow>
              <TextInput
                autoComplete="off"
                disabled={loading}
                key={form.key("accessKeyId")}
                label="Access Key ID"
                placeholder="AKIAIOSFODNN7EXAMPLE"
                styles={{ input: { fontFamily: "var(--font-mono)" } }}
                withAsterisk
                {...form.getInputProps("accessKeyId")}
              />
              <PasswordInput
                autoComplete="new-password"
                disabled={loading}
                key={form.key("secretAccessKey")}
                label="Secret Access Key"
                withAsterisk
                {...form.getInputProps("secretAccessKey")}
              />
            </Group>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--font-size-3xs)",
                margin: 0,
              }}
            >
              Your secret key is encrypted at rest and never displayed again after saving.
            </p>
          </Stack>
          <ModalFooter loading={loading} onCancel={close} submitLabel="Add provider" />
        </form>
      </Modal>

      <Button leftSection={<PlusIcon size={14} />} onClick={open} size="sm">
        Add provider
      </Button>
    </>
  );
}
