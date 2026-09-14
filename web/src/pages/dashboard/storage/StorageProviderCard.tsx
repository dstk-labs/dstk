import type { ListStorageProvidersForTableQuery } from "@/graphql/types";
import { CloudIcon } from "lucide-react";
import { useNavigate } from "react-router";

import { RowActions } from "@/components/rowActions/RowActions";
import { ArchivableStatus } from "@/components/statusBadge/StatusBadge";
import { paths } from "@/config/paths";
import { formatDate, formatRelative } from "@/utils/formatters";

import { ArchiveStorageProvider } from "./ArchiveStorageProvider";
import { EditStorageProvider } from "./EditStorageProvider";
import styles from "./StorageProviderCard.module.css";

type StorageProviderNode = NonNullable<
  NonNullable<
    NonNullable<ListStorageProvidersForTableQuery["listStorageProviders"]>["edges"]
  >[number]["node"]
>;

type StorageProviderCardProps = {
  provider: StorageProviderNode;
};

type DetailProps = {
  label: string;
  value: React.ReactNode;
};

function Detail({ label, value }: DetailProps) {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          color: "var(--color-text-muted)",
          fontSize: "var(--font-size-4xs)",
          fontWeight: "var(--font-medium)",
          letterSpacing: "0.8px",
          marginBottom: 2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "var(--font-size-xs)",
          fontWeight: "var(--font-light)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function StorageProviderCard({ provider }: StorageProviderCardProps) {
  const navigate = useNavigate();

  return (
    <article
      className={styles.card}
      onClick={() => navigate(paths.dashboard.storageItem.getPath(provider.providerId ?? ""))}
    >
      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          gap: "var(--space-3)",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "rgba(180, 140, 255, 0.08)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-purple)",
            display: "flex",
            flexShrink: 0,
            height: 40,
            justifyContent: "center",
            width: 40,
          }}
        >
          <CloudIcon size={20} />
        </div>
        <ArchivableStatus isArchived={!!provider.isArchived} />
      </div>

      <div
        style={{
          color: "var(--color-text-primary)",
          fontSize: "var(--font-size-base)",
          fontWeight: "var(--font-regular)",
          marginBottom: 2,
          overflowWrap: "anywhere",
        }}
      >
        {provider.bucket}
      </div>
      <div
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-size-2xs)",
          fontWeight: "var(--font-light)",
          wordBreak: "break-all",
        }}
      >
        {provider.endpointUrl}
      </div>

      <div
        style={{
          display: "grid",
          gap: "var(--space-3)",
          gridTemplateColumns: "1fr 1fr",
          marginBottom: "var(--space-4)",
          marginTop: 14,
        }}
      >
        <Detail label="Region" value={provider.region} />
      </div>

      <div
        style={{
          alignItems: "center",
          borderTop: "var(--border-width) solid var(--color-border-muted)",
          display: "flex",
          gap: "var(--space-3)",
          justifyContent: "space-between",
          paddingTop: 14,
        }}
      >
        <div
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--font-size-3xs)",
            fontWeight: "var(--font-light)",
          }}
          title={`Modified ${formatRelative(provider.dateModified)}`}
        >
          Created
          {" "}
          {formatDate(provider.dateCreated)}
        </div>
        <RowActions>
          <EditStorageProvider
            bucket={provider.bucket ?? ""}
            isArchived={!!provider.isArchived}
            originalAccessKeyId={provider.accessKeyId ?? ""}
            providerId={provider.providerId ?? ""}
          />
          <ArchiveStorageProvider
            bucket={provider.bucket ?? ""}
            isArchived={!!provider.isArchived}
            providerId={provider.providerId ?? ""}
          />
        </RowActions>
      </div>
    </article>
  );
}
