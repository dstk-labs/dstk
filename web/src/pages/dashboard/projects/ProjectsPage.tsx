import type { ProjectsLoader } from "@/features/projects/loaders/projectsLoader";
import { Suspense } from "react";
import { useLoaderData } from "react-router";

import { PageHeader } from "@/components/pageHeader/PageHeader";

import { AddProject } from "./AddProject";
import { ProjectsTable } from "./ProjectsTable";

export function ProjectsPage() {
  const queryRef = useLoaderData() as ProjectsLoader;

  return (
    <>
      <PageHeader
        actions={<AddProject />}
        subtitle="Group related models under a project so your team can find and manage them together."
        title="Projects"
      />
      <Suspense>
        <ProjectsTable queryRef={queryRef} />
      </Suspense>
    </>
  );
}
