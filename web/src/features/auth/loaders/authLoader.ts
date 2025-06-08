import { gql } from '@/graphql';
import { preloadQuery } from '@/lib/apollo';

const GET_USER = gql(`
    query GetUser {
        getUser {
            userId
            image
            email
            userName
        }
    }
`);

export const userLoader = async () => preloadQuery(GET_USER).toPromise();
