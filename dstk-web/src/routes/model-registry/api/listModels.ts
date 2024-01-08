import { gql, useQuery, type TypedDocumentNode, type QueryDataOptions } from '@apollo/client';

import type { MLModelList } from '@/types/MLModel';
import type { Limit } from '@/types/Limit';

const LIST_MODELS: TypedDocumentNode<MLModelList> = gql`
    query ListMLModels($after: String, $first: Limit, $modelName: String) {
        listMLModels(after: $after, first: $first, modelName: $modelName) {
            edges {
                cursor
                node {
                    modelId
                    modelName
                    currentModelVersion {
                        numericVersion
                    }
                    createdBy {
                        userName
                    }
                }
            }
            pageInfo {
                hasPreviousPage
                hasNextPage
                continuationToken
            }
        }
    }
`;

type ListModelOptions = {
    after?: string;
    first?: Limit;
    modelName?: string;
} & Omit<QueryDataOptions, 'query'>;

export const useListModels = ({ after, first = 10, modelName, ...args }: ListModelOptions) =>
    useQuery(LIST_MODELS, {
        variables: {
            after: after,
            first: first,
            modelName: modelName,
        },
        ...args,
    });
