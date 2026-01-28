import type { DocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { paths } from "@/config/paths";
import { gql } from "@/graphql";

export const GENERATE_GOOGLE_OAUTH_URL = gql(`
    mutation GenerateGoogleOAuthUrl($callbackURL: String!) {
        generateGoogleOAuthUrl(callbackURL: $callbackURL)
    }
`);

type UseOAuthRedirectOptions = {
  mutation: DocumentNode;
};

export function useOAuthRedirect({
  mutation,
}: UseOAuthRedirectOptions) {
  const [executeMutation, { loading: mutationLoading }]
    = useMutation<string>(mutation);

  const [isRedirecting, setIsRedirecting] = useState(false);

  const loading = mutationLoading || isRedirecting;

  const redirect = async () => {
    await executeMutation({
      variables: {
        callbackURL: `${window.location.origin}${paths.dashboard.overview}`,
      },
      onCompleted: (data) => {
        const url = Object.values(data)[0];
        setIsRedirecting(true);
        window.location.href = url;
      },
    });
  };

  return { redirect, loading };
}

export function useGoogleOAuth() {
  return useOAuthRedirect({
    mutation: GENERATE_GOOGLE_OAUTH_URL,
  });
}
