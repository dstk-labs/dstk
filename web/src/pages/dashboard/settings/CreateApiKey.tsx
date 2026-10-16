import { useMutation } from "@apollo/client";
import { ActionIcon, Button, CopyButton, Text, TextInput, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { CheckIcon, CopyIcon, PlusIcon } from "lucide-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { z } from "zod/v4";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { gql } from "@/graphql";

const CREATE_API_KEY = gql(`
  mutation CreateApiKey($name: String) {
    apiKey {
      create(name: $name) {
        key
      }
    }
  }
`);

const API_KEY_NAME_MAX_LENGTH = 32;

const createApiKeySchema = z.object({
  name: z.string().trim().max(API_KEY_NAME_MAX_LENGTH, `Must be ${API_KEY_NAME_MAX_LENGTH} characters or fewer`),
});

type CreateApiKeySchema = z.infer<typeof createApiKeySchema>;

export function CreateApiKey() {
  const [createApiKey, { loading }] = useMutation(CREATE_API_KEY);
  const [newKey, setNewKey] = useState("");
  const [opened, { close, open }] = useDisclosure(false);

  const createApiKeyForm = useForm({
    initialValues: { name: "" },
    mode: "uncontrolled",
    validate: zod4Resolver(createApiKeySchema),
  });

  const onOpen = () => {
    createApiKeyForm.reset();
    setNewKey("");
    open();
  };

  const onSubmit = (values: CreateApiKeySchema) =>
    createApiKey({
      onCompleted: data => setNewKey(data.apiKey.create?.key ?? ""),
      refetchQueries: ["Settings"],
      variables: { name: values.name.trim() },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        title={newKey ? "API Key Created" : "New API Key"}
      >
        {newKey
          ? <NewApiKey onDone={close} value={newKey} />
          : (
              <form onSubmit={createApiKeyForm.onSubmit(values => onSubmit(values))}>
                <TextInput
                  data-autofocus
                  disabled={loading}
                  key={createApiKeyForm.key("name")}
                  label="Name"
                  placeholder="CI pipeline"
                  {...createApiKeyForm.getInputProps("name")}
                />
                <ModalFooter loading={loading} onCancel={close} submitLabel="Create key" />
              </form>
            )}
      </Modal>

      <Button leftSection={<PlusIcon size={14} />} onClick={onOpen} size="sm">
        New API key
      </Button>
    </>
  );
}

type NewApiKeyProps = {
  onDone: () => void;
  value: string;
};

function NewApiKey({ onDone, value }: NewApiKeyProps) {
  return (
    <>
      <Text c="var(--color-text-secondary)" fw={300} mb="md" size="sm">
        Copy this key now. It will not be shown again.
      </Text>
      <div
        style={{
          alignItems: "center",
          background: "var(--color-bg-tertiary)",
          border: "var(--border-width) solid var(--color-border-default)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          gap: "var(--space-2)",
          padding: "var(--space-2) var(--space-3)",
        }}
      >
        <code style={{ flex: 1, overflowWrap: "anywhere" }}>{value}</code>
        <CopyButton value={value}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? "Copied" : "Copy"}>
              <ActionIcon aria-label="Copy API key" onClick={copy} size={24}>
                {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-6)" }}>
        <Button onClick={onDone} size="sm">
          Done
        </Button>
      </div>
    </>
  );
}
