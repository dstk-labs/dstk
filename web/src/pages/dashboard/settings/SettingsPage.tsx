import type { SettingsLoader } from "@/features/settings/loaders/settingsLoader";
import { useReadQuery } from "@apollo/client";
import { Stack } from "@mantine/core";
import { Suspense } from "react";
import { useLoaderData } from "react-router";

import { PageHeader } from "@/components/pageHeader/PageHeader";

import { ApiKeysTable } from "./ApiKeysTable";
import { InvitationsTable } from "./InvitationsTable";

function SettingsContent({ queryRef }: { queryRef: SettingsLoader }) {
  const { data } = useReadQuery(queryRef);

  const apiKeys = (data.listApiKeys ?? [])
    .filter((key): key is NonNullable<typeof key> => Boolean(key));
  const invitations = (data.listInvitations?.edges ?? [])
    .map(edge => edge.node)
    .filter((invitation): invitation is NonNullable<typeof invitation> => Boolean(invitation));

  return (
    <Stack gap="xl">
      <InvitationsTable invitations={invitations} />
      <ApiKeysTable apiKeys={apiKeys} />
    </Stack>
  );
}

export function SettingsPage() {
  const queryRef = useLoaderData() as SettingsLoader;

  return (
    <>
      <PageHeader
        subtitle="Manage your API keys and respond to team invitations."
        title="Settings"
      />
      <Suspense>
        <SettingsContent queryRef={queryRef} />
      </Suspense>
    </>
  );
}
