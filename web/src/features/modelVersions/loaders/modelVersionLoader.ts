import type { GetMlModelVersionQueryVariables } from "@/graphql/types";
import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";

export const GET_ML_MODEL_VERSION = gql(`
  query GetMLModelVersion($modelVersionId: String!) {
    getMLModelVersion(modelVersionId: $modelVersionId) {
      numericVersion
      isArchived
      isFinalized
      description
    }
  }
`);

export async function modelVersionLoader({
  modelVersionId,
}: GetMlModelVersionQueryVariables) {
  return preloadQuery(GET_ML_MODEL_VERSION, {
    variables: { modelVersionId },
  }).toPromise();
}

export type ModelVersionLoader = Awaited<ReturnType<typeof modelVersionLoader>>;
