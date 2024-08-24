import { gql, type TypedDocumentNode } from '@apollo/client';
import type { MLModel } from '@/types/api';

type GetMLModelPick = Pick<
    MLModel,
    'dateCreated' | 'dateModified' | 'description' | 'isArchived' | 'modelId' | 'modelName'
> & {
    createdBy: {
        userName: MLModel['createdBy']['userName'];
    };
    currentModelVersion?: {
        numericVersion: NonNullable<MLModel['currentModelVersion']>['numericVersion'];
    };
    project: {
        name: MLModel['project']['name'];
    };
};

type GetMLModel = {
    getMLModel: GetMLModelPick;
};

type GetMLModelVariables = {
    modelId?: string;
};

export const GET_MODEL: TypedDocumentNode<GetMLModel, GetMLModelVariables> = gql`
    query GetMLModel($modelId: String!) {
        getMLModel(modelId: $modelId) {
            createdBy {
                userName
            }
            currentModelVersion {
                numericVersion
            }
            dateCreated
            dateModified
            description
            isArchived
            modelId
            modelName
            project {
                name
            }
        }
    }
`;
