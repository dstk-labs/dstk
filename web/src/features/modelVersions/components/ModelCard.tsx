import type { ModelMetadata } from "@/features/modelVersions/utils/modelMetadata";
import { Table, TextInput } from "@mantine/core";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";

import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { Panel } from "@/components/panel/Panel";
import { SectionLabel } from "@/components/sectionLabel/SectionLabel";
import { TableCard } from "@/components/tableCard/TableCard";
import { formatParamValue } from "@/features/modelVersions/utils/modelMetadata";

type ModelCardProps = {
  metadata: ModelMetadata;
};

const MONO_TEXT = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-size-xs)",
  overflowWrap: "anywhere",
} as const;

export function ModelCard({ metadata }: ModelCardProps) {
  const details = [
    { label: "Framework", value: `${metadata.framework} ${metadata.frameworkVersion}` },
    { label: "Model class", value: metadata.modelClass },
    { label: "Python", value: metadata.pythonVersion },
    { label: "Files", value: metadata.files.join(", ") },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <Panel>
        <Panel.Header title="Model Card" />
        <Panel.Body>
          <div
            style={{
              display: "grid",
              gap: "var(--space-5)",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {details.map(detail => (
              <div key={detail.label} style={{ minWidth: 0 }}>
                <SectionLabel>{detail.label}</SectionLabel>
                <div style={MONO_TEXT}>{detail.value}</div>
              </div>
            ))}
          </div>
        </Panel.Body>
      </Panel>
      <ModelParameters params={metadata.params} />
    </div>
  );
}

function ModelParameters({ params }: Pick<ModelMetadata, "params">) {
  const [filter, setFilter] = useState("");

  const entries = Object.entries(params).map(([name, value]) => ({
    name,
    value: formatParamValue(value),
  }));
  const query = filter.trim().toLowerCase();
  const matches = entries.filter(entry =>
    entry.name.toLowerCase().includes(query) || entry.value.toLowerCase().includes(query),
  );

  return (
    <TableCard>
      <TableCard.Toolbar
        end={entries.length > 0 && (
          <TextInput
            aria-label="Filter parameters"
            leftSection={<SearchIcon size={14} style={{ opacity: 0.6 }} />}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter parameters…"
            style={{ width: 280 }}
            value={filter}
          />
        )}
        start={(
          <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-regular)" }}>
            Parameters
          </span>
        )}
      />
      <TableCard.Table minWidth={480}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Value</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {entries.length === 0 && (
            <EmptyTableRow
              colSpan={2}
              description="The framework didn't report any parameters for this model."
              icon={<SlidersHorizontalIcon size={24} />}
              title="No parameters"
            />
          )}
          {entries.length > 0 && matches.length === 0 && (
            <EmptyTableRow
              colSpan={2}
              description="No parameter name or value contains that text."
              icon={<SearchIcon size={24} />}
              title="No matching parameters"
            />
          )}
          {matches.map(entry => (
            <Table.Tr key={entry.name}>
              <Table.Td style={MONO_TEXT}>{entry.name}</Table.Td>
              <Table.Td style={{ ...MONO_TEXT, whiteSpace: "normal" }}>{entry.value}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </TableCard.Table>
    </TableCard>
  );
}
