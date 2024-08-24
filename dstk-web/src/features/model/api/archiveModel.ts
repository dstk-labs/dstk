import { gql, useMutation, type MutationOptions, type TypedDocumentNode } from '@apollo/client';
import type { MLModel } from '@/types/api';

type ArchiveMLModelPick = Pick<MLModel, 'modelId' | 'modelName'>;

type ArchiveMLModel = {
    archiveModel: ArchiveMLModelPick;
};

type ArchiveMLModelVariables = {
    modelId: string;
};

const ARCHIVE_MODEL: TypedDocumentNode<ArchiveMLModel, ArchiveMLModelVariables> = gql`
    mutation ArchiveModel($modelId: String!) {
        archiveModel(modelId: $modelId) {
            modelId
            modelName
        }
    }
`;

export const useArchiveModel = (
    options?: MutationOptions<ArchiveMLModel, ArchiveMLModelVariables>,
) => useMutation(ARCHIVE_MODEL, options);
