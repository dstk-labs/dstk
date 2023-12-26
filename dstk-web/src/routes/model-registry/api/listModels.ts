import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import type { MLModelList } from '@/types/MLModel';

const LIST_MODELS: TypedDocumentNode<MLModelList> = gql`
    query ListMLModels {
        listMLModels {
            createdBy
            modelName
            modelId
            dateModified
            currentModelVersion {
                modelVersionId
                numericVersion
            }
        }
    }
`;

export const useListModels = () => useQuery(LIST_MODELS);
