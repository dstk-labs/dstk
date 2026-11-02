import type { LoaderFunctionArgs } from "react-router";
import type { AuditAction, AuditResourceType } from "@/graphql/types";
import { z } from "zod/v4";

import { isAuditAction, isAuditResourceType } from "@/features/auditLogs/utils/auditLogLabels";
import { ensureSelectedTeam } from "@/features/teams/lib/ensureSelectedTeam";
import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";
import { ensureDefaultQueryParams } from "@/lib/ensureDefaultQueryParams";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { limitSchema, useLimitStore } from "@/stores/limitStore";

export const LIST_AUDIT_LOGS = gql(`
  query ListAuditLogs(
    $after: String
    $first: Limit!
    $teamId: String!
    $action: AuditAction
    $resourceType: AuditResourceType
    $actorId: String
    $resourceName: String
  ) {
    auditLog {
      list(
        after: $after
        first: $first
        teamId: $teamId
        action: $action
        resourceType: $resourceType
        actorId: $actorId
        resourceName: $resourceName
      ) {
        pageInfo {
          continuationToken
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            auditLogId
            action
            resourceType
            resourceName
            details
            dateCreated
            actor {
              realName
            }
          }
        }
      }
    }
    team {
      listMembers(teamId: $teamId) {
        memberId
        user {
          userId
          realName
        }
      }
    }
  }
`);

const auditLogsLoaderSchema = z.object({
  action: z.custom<AuditAction>(isAuditAction).optional(),
  actorId: z.string().optional(),
  after: z.string().optional(),
  first: limitSchema,
  resourceName: z.string().optional(),
  resourceType: z.custom<AuditResourceType>(isAuditResourceType).optional(),
});

export async function auditLogsLoader({ request }: LoaderFunctionArgs) {
  const { limit } = useLimitStore.getState();

  ensureDefaultQueryParams(request, {
    first: limit.toString(),
  });

  const queryParams = parseQueryParams(request, auditLogsLoaderSchema);

  const teamId = (await ensureSelectedTeam()) ?? "";

  return preloadQuery(LIST_AUDIT_LOGS, {
    fetchPolicy: "cache-and-network",
    variables: { teamId, ...queryParams },
  }).toPromise();
}

export type AuditLogsLoader = Awaited<ReturnType<typeof auditLogsLoader>>;
