import type { SettingsQuery } from "@/graphql/types";
import { ActionIcon, CopyButton, Table, Tooltip } from "@mantine/core";
import { CheckIcon, CopyIcon, KeyRoundIcon } from "lucide-react";

import { DateCell } from "@/components/dateCell/DateCell";
import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { RowActions } from "@/components/rowActions/RowActions";
import { TableCard } from "@/components/tableCard/TableCard";
import { maskSecret } from "@/utils/formatters";

import { ArchiveApiKey } from "./ArchiveApiKey";
import { CreateApiKey } from "./CreateApiKey";

type ApiKey = NonNullable<NonNullable<SettingsQuery["listApiKeys"]>[number]>;

type ApiKeysTableProps = {
  apiKeys: ApiKey[];
};

export function ApiKeysTable({ apiKeys }: ApiKeysTableProps) {
  return (
    <TableCard>
      <TableCard.Toolbar
        end={<CreateApiKey />}
        start={(
          <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-regular)" }}>
            API Keys
          </span>
        )}
      />
      <TableCard.Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Key</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th aria-label="Actions" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {apiKeys.length === 0 && (
            <EmptyTableRow
              colSpan={3}
              description="Create a key to authenticate the CLI and SDK."
              icon={<KeyRoundIcon size={24} />}
              title="No API keys"
            />
          )}
          {apiKeys.map(apiKey => (
            <Table.Tr key={apiKey.apiKeyId}>
              <Table.Td>
                <div style={{ alignItems: "center", display: "flex", gap: "var(--space-2)" }}>
                  <code>{maskSecret(apiKey.apiKey)}</code>
                  <CopyButton value={apiKey.apiKey ?? ""}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? "Copied" : "Copy"}>
                        <ActionIcon aria-label="Copy API key" onClick={copy} size={24}>
                          {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </div>
              </Table.Td>
              <Table.Td>
                <DateCell value={apiKey.dateCreated} />
              </Table.Td>
              <Table.Td>
                <RowActions>
                  <ArchiveApiKey apiKeyId={apiKey.apiKeyId ?? ""} />
                </RowActions>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </TableCard.Table>
    </TableCard>
  );
}
