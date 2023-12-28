import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import type { MLModelList } from '@/types/MLModel';

const LIST_MODELS: TypedDocumentNode<MLModelList> = gql`
    query ListMLModels($modelName: String) {
        listMLModels(modelName: $modelName) {
            modelName
            modelId
            createdBy
            dateCreated
            currentModelVersion {
                modelVersionId
                numericVersion
            }
        }
    }
`;

export const useListModels = () => useQuery(LIST_MODELS);
