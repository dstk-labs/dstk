import { useMutation } from "@apollo/client";
import { ActionIcon, Button, CopyButton, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CheckIcon, CopyIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/modal/Modal";
import { gql } from "@/graphql";

const CREATE_API_KEY = gql(`
  mutation CreateApiKey {
    createApiKey {
      apiKey
      apiKeyId
    }
  }
`);

export function CreateApiKey() {
  const [createApiKey, { loading }] = useMutation(CREATE_API_KEY);
  const [newKey, setNewKey] = useState("");
  const [opened, { close, open }] = useDisclosure(false);

  const onClick = () =>
    createApiKey({
      onCompleted: (data) => {
        setNewKey(data.createApiKey?.apiKey ?? "");
        open();
      },
      refetchQueries: ["Settings"],
    });

  return (
    <>
      <Modal onClose={close} opened={opened} title="API Key Created">
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
          <code style={{ flex: 1, overflowWrap: "anywhere" }}>{newKey}</code>
          <CopyButton value={newKey}>
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
          <Button onClick={close} size="sm">
            Done
          </Button>
        </div>
      </Modal>

      <Button leftSection={<PlusIcon size={14} />} loading={loading} onClick={onClick} size="sm">
        New API key
      </Button>
    </>
  );
}
