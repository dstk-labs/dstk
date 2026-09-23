import { ActionIcon, CopyButton, SimpleGrid, Text, Tooltip } from "@mantine/core";
import { CheckIcon, CopyIcon } from "lucide-react";

type BackupCodesProps = {
  codes: string[];
};

export function BackupCodes({ codes }: BackupCodesProps) {
  return (
    <>
      <div style={{ alignItems: "center", display: "flex", gap: "var(--space-2)" }}>
        <Text c="var(--color-text-secondary)" fw={300} size="sm" style={{ flex: 1 }}>
          Please save these codes somewhere safe, they will not be visible again.
        </Text>
        <CopyButton value={codes.join("\n")}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? "Copied" : "Copy all"}>
              <ActionIcon aria-label="Copy backup codes" onClick={copy} size={24}>
                {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>
      <SimpleGrid
        cols={2}
        mt="md"
        spacing="xs"
        style={{
          background: "var(--color-bg-tertiary)",
          border: "var(--border-width) solid var(--color-border-default)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-3)",
        }}
      >
        {codes.map(code => (
          <code key={code} style={{ overflowWrap: "anywhere" }}>{code}</code>
        ))}
      </SimpleGrid>
    </>
  );
}
