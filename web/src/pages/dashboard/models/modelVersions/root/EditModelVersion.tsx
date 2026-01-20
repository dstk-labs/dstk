import type { EditModelVersionMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { ActionIcon, Button, Flex, Textarea, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { EditIcon } from "lucide-react";
import { zod4Resolver } from "mantine-form-zod-resolver";

import { z } from "zod/v4";

import { Modal } from "@/components/modal/Modal";
import { gql } from "@/graphql";

const EDIT_MODEL_VERSION = gql(`
  mutation EditModelVersion(
    $data: EditModelVersion!
    $modelVersionId: String!
  ) {
    editModelVersion(data: $data, modelVersionId: $modelVersionId) {
      numericVersion
      modelId {
        modelName
      }
    }
  }
`);

const editModelVersionSchema = z.object({
  description: z.string().min(1, "Required"),
}) satisfies z.ZodType<
  Omit<EditModelVersionMutationVariables["data"], "modelId">
>;

type EditModelVersionProps = {
  isArchived: boolean;
  modelVersionId: string;
  numericVersion: number;
  originalDescription: string;
};

type EditModelVersionSchema = z.infer<typeof editModelVersionSchema>;

export function EditModelVersion({
  isArchived,
  modelVersionId,
  numericVersion,
  originalDescription,
}: EditModelVersionProps) {
  const [editModelVersion, { loading }] = useMutation(EDIT_MODEL_VERSION);

  const [opened, { close, open }] = useDisclosure(false);

  const editModelVersionForm = useForm({
    initialValues: {
      description: originalDescription,
    },
    mode: "uncontrolled",
    validate: zod4Resolver(editModelVersionSchema),
  });

  const onSubmit = (values: EditModelVersionSchema) =>
    editModelVersion({
      onCompleted: async (data) => {
        notifications.show({
          message: `Successfully edited version ${data.editModelVersion?.numericVersion} for model ${data.editModelVersion?.modelId?.modelName}`,
          title: "Success",
        });
        editModelVersionForm.reset();
        close();
      },
      refetchQueries: ["ListMLModels", "ListMLModelVersions"],
      variables: {
        data: {
          description: values.description,
        },
        modelVersionId,
      },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size="lg"
        title={`Edit Version ${numericVersion}`}
      >
        <form
          onSubmit={editModelVersionForm.onSubmit(values => onSubmit(values))}
        >
          <Textarea
            disabled={loading}
            key={editModelVersionForm.key("description")}
            label="Description"
            rows={4}
            withAsterisk
            {...editModelVersionForm.getInputProps("description")}
          />

          <Flex align="center" justify="end" mt="xl">
            <Button color="blue" loading={loading} radius="md" type="submit">
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>

      <Tooltip disabled={isArchived} label="Edit">
        <ActionIcon
          color="blue"
          disabled={isArchived}
          onClick={open}
          variant="subtle"
        >
          <EditIcon size={14} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
