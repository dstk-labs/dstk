import { useQuery } from "@apollo/client";
import { Box, LoadingOverlay, Select, Tooltip } from "@mantine/core";
import { BanIcon } from "lucide-react";

import { gql } from "@/graphql";
import { useTeamStore } from "@/stores/teamStore";

const LIST_PROJECTS_FOR_SELECT = gql(`
  query ListProjectsForSelect($teamId: String!, $includeArchived: Boolean!) {
    listProjects(teamId: $teamId, includeArchived: $includeArchived) {
      isArchived
      name
      projectId
    }
  }
`);

type ProjectsSelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "data" | "error" | "label" | "placeholder"
>;

// TODO: Ability to navigate to create project
export function ProjectsSelect({ disabled, ...props }: ProjectsSelectProps) {
  const { selectedTeam } = useTeamStore();
  const { data, loading } = useQuery(LIST_PROJECTS_FOR_SELECT, {
    variables: {
      includeArchived: true,
      // TODO: I don't like the use of !
      teamId: selectedTeam!,
    },
  });

  const hasNoProjects = data?.listProjects?.length === 0;

  return (
    <Box>
      <LoadingOverlay
        overlayProps={{ blur: 2, radius: "sm" }}
        visible={loading}
        zIndex={1000}
      />
      <Tooltip
        disabled={!hasNoProjects}
        label="No projects have been created on the currently selected team"
      >
        <Select
          data={data?.listProjects?.map(project => ({
            disabled: !!project.isArchived,
            label: project.name ?? "",
            value: project.projectId ?? "",
          }))}
          disabled={hasNoProjects || disabled}
          error={hasNoProjects}
          label="Project"
          leftSection={hasNoProjects ? <BanIcon size={14} /> : undefined}
          leftSectionPointerEvents="none"
          {...props}
        />
      </Tooltip>
    </Box>
  );
}
