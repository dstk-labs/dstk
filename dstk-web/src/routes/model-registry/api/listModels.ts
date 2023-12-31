import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import type { MLModelList } from '@/types/MLModel';

const LIST_MODELS: TypedDocumentNode<MLModelList> = gql`
    query ListMLModels($limit: Limit, $offset: Int, $modelName: String) {
        listMLModels(limit: $limit, offset: $offset, modelName: $modelName) {
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

export const useListModels = (limit?: 10 | 25 | 50, offset?: number, modelName?: string) =>
    useQuery(LIST_MODELS, {
        variables: {
            modelName: modelName,
            limit: limit,
            offset: offset,
        },
    });
