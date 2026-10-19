import { gql } from "@/graphql";

export const LOGOUT = gql(`
  mutation Logout {
    auth {
      logout
    }
  }
`);
