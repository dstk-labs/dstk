import type { CreateStorageProviderMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import {
  Button,
  Flex,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { zod4Resolver } from "mantine-form-zod-resolver";

import { z } from "zod/v4";

import { AwsRegionsSelect } from "@/components/awsRegionSelect/AwsRegionSelect";
import { Modal } from "@/components/modal/Modal";
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
  endpointUrl: z.string().min(1, "Required"),
  //   TODO: Enum with literals
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

  const createStorageProviderForm = useForm({
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
          message: `Successfully added ${data.createStorageProvider?.bucket}`,
          title: "Success",
        });
        close();
      },
      refetchQueries: [
        "ListStorageProvidersForTable",
        "ListStorageProvidersForSelect",
      ],
      variables: {
        data: {
          accessKeyId: values.accessKeyId,
          bucket: values.bucket,
          endpointUrl: values.endpointUrl,
          region: values.region,
          secretAccessKey: values.secretAccessKey,
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
        size="lg"
        title="Add Storage Provider"
      >
        <form
          onSubmit={createStorageProviderForm.onSubmit(values =>
            onSubmit(values),
          )}
        >
          <Stack gap="md">
            <TextInput
              disabled={loading}
              key={createStorageProviderForm.key("bucket")}
              label="Bucket Name"
              withAsterisk
              {...createStorageProviderForm.getInputProps("bucket")}
            />

            {/* TODO: Stack on sm */}
            <Group grow>
              <AwsRegionsSelect
                disabled={loading}
                key={createStorageProviderForm.key("region")}
                withAsterisk
                {...createStorageProviderForm.getInputProps("region")}
              />
              <TextInput
                disabled={loading}
                key={createStorageProviderForm.key("endpointUrl")}
                label="Endpoint URL"
                withAsterisk
                {...createStorageProviderForm.getInputProps("endpointUrl")}
              />
            </Group>

            {/* TODO: Stack on sm */}
            <Group grow>
              <PasswordInput
                disabled={loading}
                key={createStorageProviderForm.key("accessKeyId")}
                label="Access Key"
                withAsterisk
                {...createStorageProviderForm.getInputProps("accessKeyId")}
              />
              <PasswordInput
                disabled={loading}
                key={createStorageProviderForm.key("secretAccessKey")}
                label="Secret Access Key"
                withAsterisk
                {...createStorageProviderForm.getInputProps("secretAccessKey")}
              />
            </Group>
          </Stack>

          <Flex align="center" justify="end" mt="xl">
            <Button color="blue" loading={loading} radius="md" type="submit">
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>

      <Button fullWidth onClick={open}>
        Add Storage Provider
      </Button>
    </>
  );
}
