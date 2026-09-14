import type { ModelsLoader } from "@/features/models/loaders/modelsLoader";
import type { ProjectLoader } from "@/features/projects/loaders/projectLoader";
import { useReadQuery } from "@apollo/client";
import { Suspense } from "react";
import { useLoaderData } from "react-router";

import { MetaItem, MetaList, MetaStrong } from "@/components/metaList/MetaList";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { RowActions } from "@/components/rowActions/RowActions";
import { ArchivableStatus } from "@/components/statusBadge/StatusBadge";
import { formatDate } from "@/utils/formatters";

import { ModelsTable } from "../../models/root/ModelsTable";
import { ArchiveProject } from "../ArchiveProject";
import { EditProject } from "../EditProject";

function ProjectHeader({ queryRef }: { queryRef: ProjectLoader }) {
  const { data } = useReadQuery(queryRef);
  const project = data.getProject;
  const isArchived = !!project?.isArchived;

  return (
    <PageHeader
      actions={(
        <RowActions>
          <EditProject
            isArchived={isArchived}
            originalDescription={project?.description ?? ""}
            originalName={project?.name ?? ""}
            projectId={project?.projectId ?? ""}
          />
          <ArchiveProject
            isArchived={isArchived}
            projectId={project?.projectId ?? ""}
            projectName={project?.name ?? ""}
          />
        </RowActions>
      )}
      badge={<ArchivableStatus isArchived={isArchived} />}
      description={project?.description}
      meta={(
        <MetaList>
          <MetaItem>
            By
            {" "}
            <MetaStrong>{project?.createdBy?.realName ?? "—"}</MetaStrong>
          </MetaItem>
          <MetaItem>
            Created
            {" "}
            {formatDate(project?.dateCreated)}
          </MetaItem>
          <MetaItem>
            Modified
            {" "}
            {formatDate(project?.dateModified)}
          </MetaItem>
        </MetaList>
      )}
      title={project?.name}
    />
  );
}

export function ProjectPage() {
  const [projectQueryRef, modelsQueryRef] = useLoaderData() as [ProjectLoader, ModelsLoader];

  return (
    <Suspense>
      <ProjectHeader queryRef={projectQueryRef} />
      <ModelsTable queryRef={modelsQueryRef} />
    </Suspense>
  );
}
