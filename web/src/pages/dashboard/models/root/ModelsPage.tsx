import type { ModelsLoader } from "@/features/models/loaders/modelsLoader";
import { Suspense } from "react";
import { useRouteLoaderData } from "react-router";

import { PageHeader } from "@/components/pageHeader/PageHeader";

import { AddModel } from "./AddModel";
import { ModelsTable } from "./ModelsTable";

export function ModelsPage() {
  const queryRef = useRouteLoaderData("models") as ModelsLoader;

  return (
    <>
      <PageHeader
        actions={<AddModel />}
        subtitle="Every model registered to this team, with its latest version and storage location."
        title="Models"
      />
      <Suspense>
        <ModelsTable queryRef={queryRef} />
      </Suspense>
    </>
  );
}
