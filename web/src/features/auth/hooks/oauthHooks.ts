import type { GenerateOAuthUrlMutationVariables } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { paths } from "@/config/paths";
import { gql } from "@/graphql";

export const GENERATE_OAUTH_URL = gql(`
    mutation GenerateOAuthUrl($provider: OAuthProvider!, $callbackURL: String!) {
        generateOAuthUrl(provider: $provider, callbackURL: $callbackURL)
    }
`);

type UseOAuthRedirectOptions = {
  provider: GenerateOAuthUrlMutationVariables["provider"];
};

export function useOAuthRedirect({
  provider,
}: UseOAuthRedirectOptions) {
  const [executeMutation, { loading: mutationLoading }]
    = useMutation<{ generateOAuthUrl: string }>(GENERATE_OAUTH_URL);

  const [isRedirecting, setIsRedirecting] = useState(false);

  const loading = mutationLoading || isRedirecting;

  const redirect = async () => {
    await executeMutation({
      variables: {
        provider,
        callbackURL: `${window.location.origin}${paths.dashboard.overview.path}`,
      },
      onCompleted: (data) => {
        setIsRedirecting(true);
        window.location.href = data.generateOAuthUrl;
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
