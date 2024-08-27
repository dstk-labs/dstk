import {
    gql,
    useSuspenseQuery,
    type SuspenseQueryHookOptions,
    type TypedDocumentNode,
} from '@apollo/client';
import type { Edge, MLModel } from '@/types/api';
import type { Limit } from '@/types/filters';

type ListMLModelPick = Pick<MLModel, 'modelId' | 'modelName' | 'dateModified'> & {
    currentModelVersion?: {
        numericVersion: NonNullable<MLModel['currentModelVersion']>['numericVersion'];
    };
    project: {
        name: MLModel['project']['name'];
    };
};

type ListMLModel = {
    listMLModels: Edge<ListMLModelPick>;
};

type ListMLModelVariables = {
    after?: string;
    first: Limit;
    modelName?: string;
};

export const LIST_MODELS: TypedDocumentNode<ListMLModel, ListMLModelVariables> = gql`
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
                    project {
                        name
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

export const useListModels = (
    options: SuspenseQueryHookOptions<ListMLModel, ListMLModelVariables>,
) => useSuspenseQuery(LIST_MODELS, options);
