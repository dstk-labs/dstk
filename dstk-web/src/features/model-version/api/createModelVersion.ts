import { gql, useMutation, type MutationOptions, type TypedDocumentNode } from '@apollo/client';
import type { MLModelVersion } from '@/types/api';

type CreateMLModelVersionPick = Pick<MLModelVersion, 'numericVersion' | 'modelVersionId'>;

type CreateMLModelVersion = {
    createModelVersion: CreateMLModelVersionPick;
};

type CreateMLModelVersionVariables = {
    data: {
        description?: string;
        modelId: string;
    };
};

const CREATE_MODEL_VERSION: TypedDocumentNode<CreateMLModelVersion, CreateMLModelVersionVariables> =
    gql`
        mutation CreateModelVersion($data: ModelVersionInput!) {
            createModelVersion(data: $data) {
                numericVersion
            }
        }
    `;

export const useCreateModelVersion = (
    options?: MutationOptions<CreateMLModelVersion, CreateMLModelVersionVariables>,
) => useMutation(CREATE_MODEL_VERSION, options);
