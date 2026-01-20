import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";

export const GET_USER = gql(`
    query GetUser {
        getUser {
            userId
            image
            email
            realName
            userName
        }
    }
`);

export const userLoader = async () => preloadQuery(GET_USER).toPromise();
