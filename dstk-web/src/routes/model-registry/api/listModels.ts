import { useAtom } from 'jotai';
import { gql, type TypedDocumentNode, useQuery } from '@apollo/client';

import type { MLModelList } from '@/types/MLModel';

import { modelRegistryPaginationAtom } from '../atoms';

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
                    dateModified
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

export const useListModels = () => {
    const [inputs, setInputs] = useAtom(modelRegistryPaginationAtom);

    return useQuery(LIST_MODELS, {
        variables: {
            after: inputs.continuationTokens.at(-1),
            first: inputs.first,
            modelName: inputs.modelName,
        },
        onCompleted: (data) =>
            setInputs((values) => ({
                ...values,
                hasPreviousPage: data.listMLModels.pageInfo.hasPreviousPage,
                hasNextPage: data.listMLModels.pageInfo.hasNextPage,
            })),
    });
};
