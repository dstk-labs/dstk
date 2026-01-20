import type { ProjectsLoader } from "@/features/projects/loaders/projectsLoader";
import { Suspense } from "react";

import { useLoaderData } from "react-router";

import { IncludeArchivedSwitch } from "@/components/includeArchivedSwitch/IncludeArchivedSwitch";
import { SearchParamTextInput } from "@/components/searchParamInput/SearchParamInput";

import { AddProject } from "./AddProject";
import styles from "./ProjectsPage.module.css";
import { ProjectsTable } from "./ProjectsTable";

export function ProjectsPage() {
  const queryRef = useLoaderData() as ProjectsLoader;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.searchContainer}>
          <SearchParamTextInput param="projectName" />
        </div>
        <div className={styles.toolbar}>
          <IncludeArchivedSwitch />
          <div className={styles.buttonContainer}>
            <AddProject />
          </div>
        </div>
      </header>
      <Suspense>
        <ProjectsTable queryRef={queryRef} />
      </Suspense>
    </>
  );
}
