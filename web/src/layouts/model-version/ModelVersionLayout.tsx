import type { ModelVersionLoader } from "@/features/modelVersions/loaders/modelVersionLoader";
import { useReadQuery } from "@apollo/client";
import { Tabs } from "@mantine/core";
import { Outlet, useLoaderData, useLocation, useNavigate, useParams } from "react-router";

import { MetaItem, MetaList, MetaStrong } from "@/components/metaList/MetaList";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { ModelVersionStatus } from "@/components/statusBadge/StatusBadge";
import { paths } from "@/config/paths";
import { PublishModelVersion } from "@/features/modelVersions/components/PublishModelVersion";
import { formatDate } from "@/utils/formatters";

type TabValue = "artifacts" | "card" | "logs";

const TABS: { label: string; value: TabValue }[] = [
  { label: "Model Card", value: "card" },
  { label: "Artifacts", value: "artifacts" },
  { label: "Logs", value: "logs" },
];

export function ModelVersionLayout() {
  const queryRef = useLoaderData() as ModelVersionLoader;
  const { data } = useReadQuery(queryRef);
  const version = data.getMLModelVersion;

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { modelId = "", modelVersionId = "" } = useParams();

  const tabPaths: Record<TabValue, string> = {
    artifacts: paths.dashboard.modelVersionArtifacts.getPath(modelId, modelVersionId),
    card: paths.dashboard.modelVersionCard.getPath(modelId, modelVersionId),
    logs: paths.dashboard.modelVersionLogs.getPath(modelId, modelVersionId),
  };

  const activeTab
    = (Object.keys(tabPaths) as TabValue[]).find(tab => pathname.startsWith(tabPaths[tab]))
      ?? "card";

  return (
    <>
      <PageHeader
        actions={(
          <PublishModelVersion
            isArchived={!!version?.isArchived}
            isFinalized={!!version?.isFinalized}
            modelVersionId={modelVersionId}
            numericVersion={version?.numericVersion ?? 0}
          />
        )}
        badge={(
          <ModelVersionStatus
            isArchived={!!version?.isArchived}
            isFinalized={!!version?.isFinalized}
          />
        )}
        description={version?.description}
        meta={(
          <MetaList>
            <MetaItem>
              By
              {" "}
              <MetaStrong>{version?.createdBy?.realName ?? "—"}</MetaStrong>
            </MetaItem>
            <MetaItem>
              Created
              {" "}
              {formatDate(version?.dateCreated)}
            </MetaItem>
          </MetaList>
        )}
        title={(
          <span style={{ fontFamily: "var(--font-mono)" }}>
            v
            {version?.numericVersion}
          </span>
        )}
      />
      <Tabs
        mb="xl"
        onChange={value => value && navigate(tabPaths[value as TabValue])}
        value={activeTab}
      >
        <Tabs.List>
          {TABS.map(tab => (
            <Tabs.Tab key={tab.value} value={tab.value}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
      <Outlet />
    </>
  );
}
