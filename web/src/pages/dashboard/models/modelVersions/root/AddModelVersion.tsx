import type { CreateModelVersionMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { Button, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ArrowUpIcon } from "lucide-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { gql } from "@/graphql";

const CREATE_MODEL_VERSION = gql(`
  mutation CreateModelVersion($data: ModelVersionInput!) {
    createModelVersion(data: $data) {
      numericVersion
      modelId {
        modelName
      }
    }
  }
`);

const createModelVersionSchema = z.object({
  description: z.string().min(1, "Required"),
}) satisfies z.ZodType<
  Omit<CreateModelVersionMutationVariables["data"], "modelId">
>;

type AddModelVersionProps = {
  disabled: boolean;
  modelId: string;
};

type CreateModelVersionSchema = z.infer<typeof createModelVersionSchema>;

export function AddModelVersion({
  disabled,
  modelId,
}: AddModelVersionProps) {
  const [createModelVersion, { loading }] = useMutation(CREATE_MODEL_VERSION);

  const [opened, { close, open }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      description: "",
    },
    mode: "uncontrolled",
    validate: zod4Resolver(createModelVersionSchema),
  });

  const onSubmit = (values: CreateModelVersionSchema) => {
    createModelVersion({
      onCompleted: (data) => {
        notifications.show({
          color: "green",
          message: `Created v${data.createModelVersion?.numericVersion} of ${data.createModelVersion?.modelId?.modelName}`,
          title: "Version created",
        });
        form.reset();
        close();
      },
      refetchQueries: ["ListMLModels", "ListMLModelVersions", "GetMLModel"],
      variables: {
        data: {
          description: values.description,
          modelId,
        },
      },
    });
  };

  return (
    <>
      <Modal disabled={loading} onClose={close} opened={opened} title="Push New Version">
        <form onSubmit={form.onSubmit(values => onSubmit(values))}>
          <Textarea
            autosize
            data-autofocus
            disabled={loading}
            key={form.key("description")}
            label="What changed?"
            minRows={4}
            placeholder="e.g. Retrained on Q4 data. AUC 0.94 → 0.97"
            withAsterisk
            {...form.getInputProps("description")}
          />
          <ModalFooter loading={loading} onCancel={close} submitLabel="Create version" />
        </form>
      </Modal>

      <Button
        disabled={disabled}
        leftSection={<ArrowUpIcon size={14} />}
        onClick={open}
        size="sm"
      >
        Push version
      </Button>
    </>
  );
}
