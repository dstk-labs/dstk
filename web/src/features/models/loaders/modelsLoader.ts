import type { LoaderFunctionArgs } from "react-router";
import { z } from "zod/v4";

import { ensureSelectedTeam } from "@/features/teams/lib/ensureSelectedTeam";
import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";
import { ensureDefaultQueryParams } from "@/lib/ensureDefaultQueryParams";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { limitSchema, useLimitStore } from "@/stores/limitStore";

export const LIST_MODELS = gql(`
  query ListMLModels(
    $after: String
    $first: Limit!
    $modelName: String
    $includeArchived: Boolean!
    $projectId: String
    $teamId: String!
  ) {
    listMLModels(
      after: $after
      first: $first
      modelName: $modelName
      includeArchived: $includeArchived
      projectId: $projectId
      teamId: $teamId
    ) {
      pageInfo {
        continuationToken
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          currentModelVersion {
            numericVersion
          }
          dateModified
          description
          isArchived
          modelId
          modelName
          project {
            name
            projectId
          }
          storageProvider {
            bucket
            providerId
          }
        }
      }
    }
  }
`);

const modelsLoaderSchema = z.object({
  after: z.string().optional(),
  first: limitSchema,
  includeArchived: z.string().transform(val => val === "true"),
  modelName: z.string().optional(),
});

export async function modelsLoader({ params, request }: LoaderFunctionArgs) {
  const { limit } = useLimitStore.getState();

  ensureDefaultQueryParams(request, {
    first: limit.toString(),
    includeArchived: "false",
  });

  const queryParams = parseQueryParams(request, modelsLoaderSchema);

  const teamId = (await ensureSelectedTeam()) ?? "";

  return preloadQuery(LIST_MODELS, {
    fetchPolicy: "cache-and-network",
    variables: { projectId: params.projectId, teamId, ...queryParams },
  }).toPromise();
}

export type ModelsLoader = Awaited<ReturnType<typeof modelsLoader>>;
