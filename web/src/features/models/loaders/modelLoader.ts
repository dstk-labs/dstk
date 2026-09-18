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
      dateCreated
      createdBy {
        realName
      }
      currentModelVersion {
        numericVersion
      }
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
`);

export async function modelLoader({ modelId }: GetMlModelQueryVariables) {
  return preloadQuery(GET_ML_MODEL, {
    variables: { modelId },
  }).toPromise();
}

export type ModelLoader = Awaited<ReturnType<typeof modelLoader>>;
