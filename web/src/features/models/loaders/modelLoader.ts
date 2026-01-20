import type { GetMlModelQueryVariables } from "@/graphql/types";
import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";

export const GET_ML_MODEL = gql(`
  query GetMLModel($modelId: String!) {
    getMLModel(modelId: $modelId) {
      modelId
      modelName
      isArchived
      description
      project {
        projectId
      }
      storageProvider {
        providerId
      }
    }
  }
`);

export async function modelLoader({ modelId }: GetMlModelQueryVariables) {
  return preloadQuery(GET_ML_MODEL, {
    variables: { modelId },
  }).toPromise();
}

export type ModelLoader = Awaited<ReturnType<typeof modelLoader>>;
