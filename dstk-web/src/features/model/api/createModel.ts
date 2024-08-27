import { gql, useMutation, type MutationOptions, type TypedDocumentNode } from '@apollo/client';
import type { MLModel } from '@/types/api';

type CreateMLModelPick = Pick<MLModel, 'modelName'>;

type CreateMLModel = {
    createModel: CreateMLModelPick;
};

type CreateMLModelVariables = {
    data: {
        description: string; // TODO: This should be optional
        modelName: string;
        projectId: string;
        storageProviderId: string;
    };
};

const CREATE_MODEL: TypedDocumentNode<CreateMLModel, CreateMLModelVariables> = gql`
    mutation CreateModel($data: ModelInput!) {
        createModel(data: $data) {
            modelName
        }
    }
`;

export const useCreateModel = (options?: MutationOptions<CreateMLModel, CreateMLModelVariables>) =>
    useMutation(CREATE_MODEL, options);
