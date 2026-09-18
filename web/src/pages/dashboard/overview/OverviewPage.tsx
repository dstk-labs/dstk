import type { OverviewLoader } from "@/features/overview/loaders/overviewLoader";
import { useReadQuery } from "@apollo/client";
import { SimpleGrid } from "@mantine/core";
import { Suspense } from "react";
import { useLoaderData } from "react-router";

import { PageHeader } from "@/components/pageHeader/PageHeader";
import { StatCard } from "@/components/statCard/StatCard";
import { useUser } from "@/features/auth/hooks/authHooks";

import { QuickActions } from "./QuickActions";
import { RecentModels } from "./RecentModels";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12)
    return "Good morning";
  if (hour < 18)
    return "Good afternoon";
  return "Good evening";
}

function OverviewContent({ queryRef }: { queryRef: OverviewLoader }) {
  const { data } = useReadQuery(queryRef);

  const models = data.listMLModels?.edges ?? [];
  const projects = data.listProjects?.edges ?? [];
  const providers = data.listStorageProviders?.edges ?? [];
  const finalized = models.filter(edge => edge.node?.currentModelVersion?.isFinalized).length;

  return (
    <>
      <SimpleGrid cols={{ base: 2, lg: 4 }} mb="lg" spacing="md">
        <StatCard label="Models" value={models.length} />
        <StatCard label="Finalized" value={finalized} />
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Storage Providers" value={providers.length} />
      </SimpleGrid>
      <div style={{ marginBottom: "var(--space-6)" }}>
        <QuickActions />
      </div>
      <RecentModels models={models} />
    </>
  );
}

export function OverviewPage() {
  const queryRef = useLoaderData() as OverviewLoader;
  const { user } = useUser();
  const firstName = user?.realName?.split(" ")[0] ?? user?.userName ?? "there";

  return (
    <>
      <PageHeader
        subtitle="Here's what's happening across your model registry today."
        title={`${greeting()}, ${firstName}`}
      />
      <Suspense>
        <OverviewContent queryRef={queryRef} />
      </Suspense>
    </>
  );
}
