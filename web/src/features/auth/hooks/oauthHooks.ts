import type { GenerateOAuthUrlMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { gql } from "@/graphql";

import { useRedirectTo } from "./redirectHooks";

export const GENERATE_OAUTH_URL = gql(`
    mutation GenerateOAuthUrl($provider: OAuthProvider!, $callbackURL: String!) {
        auth {
          generateOAuthUrl(provider: $provider, callbackURL: $callbackURL)
        }
    }
`);

type UseOAuthRedirectOptions = {
  provider: GenerateOAuthUrlMutationVariables["provider"];
};

export function useOAuthRedirect({
  provider,
}: UseOAuthRedirectOptions) {
  const [executeMutation, { loading: mutationLoading }]
    = useMutation(GENERATE_OAUTH_URL);

  const [isRedirecting, setIsRedirecting] = useState(false);
  const { destination } = useRedirectTo();

  const loading = mutationLoading || isRedirecting;

  const redirect = async () => {
    await executeMutation({
      variables: {
        provider,
        callbackURL: `${window.location.origin}${destination}`,
      },
      onCompleted: (data) => {
        const url = data.auth.generateOAuthUrl;
        if (!url) {
          return;
        }

        setIsRedirecting(true);
        window.location.href = url;
      },
    });
  };

  return { redirect, loading };
}

export function useGoogleOAuth() {
  return useOAuthRedirect({
    provider: "google",
  });
}

export function useGithubOAuth() {
  return useOAuthRedirect({
    provider: "github",
  });
}
