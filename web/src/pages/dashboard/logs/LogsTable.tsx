import type { AuditLogsLoader } from "@/features/auditLogs/loaders/auditLogsLoader";
import { useReadQuery } from "@apollo/client";

import { LimitSelector } from "@/components/limitSelector/LimitSelector";
import { Pagination } from "@/components/pagination/Pagination";
import { SearchParamTextInput } from "@/components/searchParamInput/SearchParamInput";
import { SearchParamSelect } from "@/components/searchParamSelect/SearchParamSelect";
import { TableCard } from "@/components/tableCard/TableCard";
import { AuditLogTable } from "@/features/auditLogs/components/AuditLogTable";
import { ACTION_LABELS, RESOURCE_TYPE_LABELS } from "@/features/auditLogs/utils/auditLogLabels";
import { useContinuationTokens } from "@/hooks/useContinuationTokens";

const ACTION_OPTIONS = Object.entries(ACTION_LABELS).map(([value, label]) => ({ label, value }));
const RESOURCE_TYPE_OPTIONS = Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => ({ label, value }));

export function LogsTable({ queryRef }: { queryRef: AuditLogsLoader }) {
  const { data } = useReadQuery(queryRef);
  const pageInfo = data.auditLog.list?.pageInfo;
  const continuationTokens = useContinuationTokens(pageInfo?.continuationToken);

  const logs = (data.auditLog.list?.edges ?? [])
    .map(edge => edge.node)
    .filter((log): log is NonNullable<typeof log> => Boolean(log));

  const memberOptions = (data.team.listMembers ?? []).flatMap(member =>
    member?.user?.userId
      ? [{ label: member.user.realName ?? member.user.userId, value: member.user.userId }]
      : [],
  );

  return (
    <TableCard>
      <TableCard.Toolbar
        end={(
          <>
            <SearchParamSelect data={RESOURCE_TYPE_OPTIONS} param="resourceType" placeholder="Any resource" />
            <SearchParamSelect data={ACTION_OPTIONS} param="action" placeholder="Any action" />
            <SearchParamSelect data={memberOptions} param="actorId" placeholder="Any member" />
          </>
        )}
        start={<SearchParamTextInput param="resourceName" placeholder="Search by name…" />}
      />
      <AuditLogTable emptyDescription="No logs match these filters." logs={logs} />
      <TableCard.Footer
        end={(
          <Pagination
            continuationTokens={continuationTokens}
            hasNextPage={!!pageInfo?.hasNextPage}
            hasPreviousPage={!!pageInfo?.hasPreviousPage}
          />
        )}
        start={<LimitSelector />}
      />
    </TableCard>
  );
}
