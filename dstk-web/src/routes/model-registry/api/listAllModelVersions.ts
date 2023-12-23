import { gql, useQuery, type TypedDocumentNode } from "@apollo/client";

import { MLModelVersionList } from "@/types/MLModelVersion";

const LIST_ALL_MODEL_VERSIONS: TypedDocumentNode<MLModelVersionList> = gql`
    query ListAllModelVersions {
        listAllModelVersions {
            modelId {
                modelName
                modelId
                dateModified
            }
            numericVersion
            modelVersionId
        }
    }
`;

export const useListAllModelVersions = () => useQuery(LIST_ALL_MODEL_VERSIONS);
