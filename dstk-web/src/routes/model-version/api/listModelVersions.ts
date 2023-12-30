import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import type { MLModelVersionList } from '@/types/MLModelVersion';

const LIST_MODEL_VERSIONS: TypedDocumentNode<MLModelVersionList> = gql`
    query ListMLModelVersions($modelId: String!) {
        listMLModelVersions(modelId: $modelId) {
            createdBy
            dateCreated
            modelVersionId
            numericVersion
        }
    }
`;

export const useListModelVersions = (modelId: string) =>
    useQuery(LIST_MODEL_VERSIONS, {
        variables: {
            modelId: modelId,
        },
    });
