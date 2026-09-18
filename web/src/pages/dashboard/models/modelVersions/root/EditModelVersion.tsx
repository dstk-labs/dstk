import type { EditModelVersionMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { Textarea } from "@mantine/core";
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

  const form = useForm({
    initialValues: {
      description: originalDescription,
    },
    mode: "uncontrolled",
    validate: zod4Resolver(editModelVersionSchema),
  });

  const onSubmit = (values: EditModelVersionSchema) =>
    editModelVersion({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Saved changes to v${data.editModelVersion?.numericVersion}`,
          title: "Version updated",
        });
        close();
      },
      refetchQueries: ["ListMLModels", "ListMLModelVersions", "GetMLModelVersion"],
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
        title={`Edit v${numericVersion}`}
      >
        <form onSubmit={form.onSubmit(values => onSubmit(values))}>
          <Textarea
            autosize
            disabled={loading}
            key={form.key("description")}
            label="Description"
            minRows={4}
            withAsterisk
            {...form.getInputProps("description")}
          />
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
