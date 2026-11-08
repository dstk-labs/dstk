import type { AuditLogsLoader } from "@/features/auditLogs/loaders/auditLogsLoader";
import { Suspense } from "react";
import { useLoaderData } from "react-router";

import { PageHeader } from "@/components/pageHeader/PageHeader";

import { LogsTable } from "./LogsTable";

export function LogsPage() {
  const queryRef = useLoaderData() as AuditLogsLoader;

  return (
    <>
      <PageHeader
        subtitle="Changes to this team's projects, storage providers, models and versions, newest first."
        title="Logs"
      />
      <Suspense>
        <LogsTable queryRef={queryRef} />
      </Suspense>
    </>
  );
}
