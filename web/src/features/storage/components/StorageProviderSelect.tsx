import { useQuery } from "@apollo/client";
import { Select } from "@mantine/core";

import { gql } from "@/graphql";
import { useTeamStore } from "@/stores/teamStore";

const LIST_STORAGE_PROVIDERS_FOR_SELECT = gql(`
  query ListStorageProvidersForSelect($teamId: String!) {
    listStorageProviders(teamId: $teamId, first: 50) {
      edges {
        node {
          bucket
          providerId
        }
      }
    }
  }
`);

type StorageProviderSelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "data" | "error" | "label" | "placeholder"
>;

export function StorageProviderSelect({
  disabled,
  ...props
}: StorageProviderSelectProps) {
  const { selectedTeam } = useTeamStore();
  const { data, loading } = useQuery(LIST_STORAGE_PROVIDERS_FOR_SELECT, {
    skip: !selectedTeam,
    variables: { teamId: selectedTeam ?? "" },
  });

  const providers = data?.listStorageProviders?.edges ?? [];
  const hasNoStorage = !loading && providers.length === 0;

  return (
    <Select
      data={providers.map(({ node }) => ({
        label: node?.bucket ?? "",
        value: node?.providerId ?? "",
      }))}
      description={
        hasNoStorage ? "No storage providers exist on the selected team yet." : undefined
      }
      disabled={hasNoStorage || disabled || loading}
      label="Storage Provider"
      placeholder={loading ? "Loading…" : "Select a storage provider"}
      {...props}
    />
  );
}
