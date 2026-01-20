import type { TeamsTableLoader } from "@/features/teams/loaders/teamsLoader";
import { Suspense } from "react";

import { useLoaderData } from "react-router";

import { IncludeArchivedSwitch } from "@/components/includeArchivedSwitch/IncludeArchivedSwitch";
import { SearchParamTextInput } from "@/components/searchParamInput/SearchParamInput";

import { AddTeam } from "./AddTeam";
import styles from "./TeamsPage.module.css";
import { TeamsTable } from "./TeamsTable";

export function TeamsPage() {
  const queryRef = useLoaderData() as TeamsTableLoader;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.searchContainer}>
          <SearchParamTextInput param="teamName" />
        </div>
        <div className={styles.toolbar}>
          <IncludeArchivedSwitch />
          <div className={styles.buttonContainer}>
            <AddTeam />
          </div>
        </div>
      </header>
      <Suspense>
        <TeamsTable queryRef={queryRef} />
      </Suspense>
    </>
  );
}
