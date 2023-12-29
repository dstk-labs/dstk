import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';

import type { ArchiveMLModel } from '@/types/MLModel';

const ARCHIVE_MODEL: TypedDocumentNode<ArchiveMLModel> = gql`
    mutation ArchiveModel($modelId: String!) {
        archiveModel(modelId: $modelId) {
            modelId
        }
    }
`;

export const useArchiveModel = () => useMutation(ARCHIVE_MODEL);
