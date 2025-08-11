import { gql } from '@/graphql';
import { GetMlModelVersionQueryVariables } from '@/graphql/types';
import { preloadQuery } from '@/lib/apollo';

export const GET_ML_MODEL_VERSION = gql(`
  query GetMLModelVersion($modelVersionId: String!) {
    getMLModelVersion(modelVersionId: $modelVersionId) {
      numericVersion
    }
  }
`);

export const modelVersionLoader = async ({
  modelVersionId,
}: GetMlModelVersionQueryVariables) => {
  return preloadQuery(GET_ML_MODEL_VERSION, {
    variables: { modelVersionId },
  }).toPromise();
};

export type ModelVersionLoader = Awaited<ReturnType<typeof modelVersionLoader>>;
