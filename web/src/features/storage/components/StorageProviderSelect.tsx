import { useQuery } from "@apollo/client";
import { Box, LoadingOverlay, Select, Tooltip } from "@mantine/core";
import { BanIcon } from "lucide-react";

import { gql } from "@/graphql";
import { useTeamStore } from "@/stores/teamStore";

const LIST_STORAGE_PROVIDERS_FOR_SELECT = gql(`
  query ListStorageProvidersForSelect($teamId: String!) {
    listStorageProviders(teamId: $teamId) {
      bucket
      providerId
    }
  }
`);

type StorageProviderSelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "data" | "error" | "label" | "placeholder"
>;

// TODO: Ability to navigate to create storage
export function StorageProviderSelect({
  disabled,
  ...props
}: StorageProviderSelectProps) {
  const { selectedTeam } = useTeamStore();
  const { data, loading } = useQuery(LIST_STORAGE_PROVIDERS_FOR_SELECT, {
    variables: {
      // TODO: I don't like the use of !
      teamId: selectedTeam!,
    },
  });

  const hasNoStorage = data?.listStorageProviders?.length === 0;

  return (
    <Box>
      <LoadingOverlay
        overlayProps={{ blur: 2, radius: "sm" }}
        visible={loading}
        zIndex={1000}
      />
      <Tooltip
        disabled={!hasNoStorage}
        label="No storage providers have been registered with the currently selected team"
      >
        <Select
          data={data?.listStorageProviders?.map(storageProvider => ({
            label: storageProvider.bucket ?? "",
            value: storageProvider.providerId ?? "",
          }))}
          disabled={hasNoStorage || disabled}
          error={hasNoStorage}
          label="Storage Provider"
          leftSection={hasNoStorage ? <BanIcon size={14} /> : undefined}
          leftSectionPointerEvents="none"
          {...props}
        />
      </Tooltip>
    </Box>
  );
}
