import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";

export const GET_USER = gql(`
    query GetUser {
        getUser {
            userId
            image
            email
            isEmailVerified
            isTwoFactorEnabled
            hasPassword
            realName
            userName
        }
    }
`);

export async function userLoader() {
  return preloadQuery(GET_USER, { errorPolicy: "all" }).toPromise();
}
