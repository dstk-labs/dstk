import type { OverviewQuery } from "@/graphql/types";
import { Table } from "@mantine/core";
import { BoxIcon } from "lucide-react";
import { useNavigate } from "react-router";

import { Anchor } from "@/components/anchor/Anchor";
import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { InitialsAvatar } from "@/components/initialsAvatar/InitialsAvatar";
import { ModelVersionStatus } from "@/components/statusBadge/StatusBadge";
import { TableCard } from "@/components/tableCard/TableCard";
import { VersionTag } from "@/components/versionTag/VersionTag";
import { paths } from "@/config/paths";
import { formatRelative, truncate } from "@/utils/formatters";

import styles from "./RecentModels.module.css";

type RecentModelsProps = {
  models: NonNullable<NonNullable<OverviewQuery["listMLModels"]>["edges"]>;
};

export function RecentModels({ models }: RecentModelsProps) {
  const navigate = useNavigate();

  const nodes = models
    .map(edge => edge.node)
    .filter((model): model is NonNullable<typeof model> => Boolean(model))
    .sort((a, b) => (b.dateModified ?? "").localeCompare(a.dateModified ?? ""))
    .slice(0, 5);

  return (
    <TableCard>
      <TableCard.Toolbar
        end={(
          <Anchor size="xs" to={paths.dashboard.models.path}>
            View all →
          </Anchor>
        )}
        start={(
          <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-regular)" }}>
            Recent Models
          </span>
        )}
      />
      <TableCard.Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Model</Table.Th>
            <Table.Th>Project</Table.Th>
            <Table.Th>Version</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Modified By</Table.Th>
            <Table.Th>Updated</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {nodes.length === 0 && (
            <EmptyTableRow
              colSpan={6}
              description="Models registered to this team will show up here."
              icon={<BoxIcon size={24} />}
              title="No models yet"
            />
          )}
          {nodes.map(model => (
            <Table.Tr
              className={styles.row}
              key={model.modelId}
              onClick={() => navigate(paths.dashboard.model.getPath(model.modelId ?? ""))}
            >
              <Table.Td>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ fontFamily: "var(--font-mono)" }}>{model.modelName}</span>
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "var(--font-size-3xs)",
                      fontWeight: "var(--font-light)",
                    }}
                  >
                    {truncate(model.description, 48)}
                  </span>
                </div>
              </Table.Td>
              <Table.Td>{model.project?.name ?? "—"}</Table.Td>
              <Table.Td>
                {model.currentModelVersion?.numericVersion
                  ? <VersionTag version={model.currentModelVersion.numericVersion} />
                  : <span style={{ color: "var(--color-text-muted)" }}>—</span>}
              </Table.Td>
              <Table.Td>
                {model.currentModelVersion
                  ? (
                      <ModelVersionStatus
                        isArchived={!!model.currentModelVersion.isArchived}
                        isFinalized={!!model.currentModelVersion.isFinalized}
                      />
                    )
                  : <span style={{ color: "var(--color-text-muted)" }}>No versions</span>}
              </Table.Td>
              <Table.Td>
                <div style={{ alignItems: "center", display: "flex", gap: "var(--space-2)" }}>
                  <InitialsAvatar name={model.modifiedBy?.realName ?? ""} size={24} />
                  {model.modifiedBy?.realName ?? "—"}
                </div>
              </Table.Td>
              <Table.Td>{formatRelative(model.dateModified)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </TableCard.Table>
    </TableCard>
  );
}
