import type { ModelVersionLoader } from "@/features/modelVersions/loaders/modelVersionLoader";
import { useReadQuery } from "@apollo/client";
import { Badge, Box, Tabs, Text, Title } from "@mantine/core";

import { Outlet, useLoaderData, useNavigate, useParams } from "react-router";
import { paths } from "@/config/paths";

import styles from "./ModelVersionLayout.module.css";

type TabValues = "artifacts" | "card" | "logs";

export function ModelVersionLayout() {
  const queryRef = useLoaderData() as ModelVersionLoader;
  const { data } = useReadQuery(queryRef);

  const navigate = useNavigate();
  const { modelId, modelVersionId } = useParams();

  const handleTabNavigation = (value: TabValues) => {
    if (value === "artifacts") {
      navigate(
        paths.dashboard.modelVersionArtifacts.getPath(
          modelId!,
          modelVersionId!,
        ),
      );
    }

    if (value === "card") {
      navigate(
        paths.dashboard.modelVersionCard.getPath(modelId!, modelVersionId!),
      );
    }

    if (value === "logs") {
      navigate(
        paths.dashboard.modelVersionLogs.getPath(modelId!, modelVersionId!),
      );
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.attributes}>
          <div className={styles.status}>
            <Title order={4}>
              Version
              {" "}
              {data.getMLModelVersion?.numericVersion}
            </Title>
            <Badge
              color={
                data.getMLModelVersion?.isArchived
                  ? "red"
                  : data.getMLModelVersion?.isFinalized
                    ? "green"
                    : "blue"
              }
            >
              {data.getMLModelVersion?.isArchived
                ? "Archived"
                : data.getMLModelVersion?.isFinalized
                  ? "Deployed"
                  : "Pending"}
            </Badge>
          </div>
          <Text c="dimmed" fw={500} size="sm">
            {data.getMLModelVersion?.description}
          </Text>
        </div>
      </header>
      <Tabs
        defaultValue="card"
        my="xl"
        // @ts-expect-error this works fine, typescript is cranky about nulls
        onChange={(value: TabValues) => handleTabNavigation(value)}
        // value={tabValue}
      >
        <Tabs.List>
          <Tabs.Tab value="card">Model Card</Tabs.Tab>
          <Tabs.Tab value="artifacts">Artifacts</Tabs.Tab>
          <Tabs.Tab value="logs">Logs</Tabs.Tab>
        </Tabs.List>
        <Box py="xl">
          <Outlet />
        </Box>
      </Tabs>
    </>
  );
}
