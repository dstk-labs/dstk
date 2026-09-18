import type { TeamsTableLoader } from "@/features/teams/loaders/teamsLoader";
import { Suspense } from "react";
import { useLoaderData } from "react-router";

import { PageHeader } from "@/components/pageHeader/PageHeader";

import { AddTeam } from "./AddTeam";
import { TeamsTable } from "./TeamsTable";

export function TeamsPage() {
  const queryRef = useLoaderData() as TeamsTableLoader;

  return (
    <>
      <PageHeader
        actions={<AddTeam />}
        subtitle="Teams own projects, models, and storage providers. Switch teams from the sidebar."
        title="Teams"
      />
      <Suspense>
        <TeamsTable queryRef={queryRef} />
      </Suspense>
    </>
  );
}
