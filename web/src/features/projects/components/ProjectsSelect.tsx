import { useQuery } from "@apollo/client";
import { Select } from "@mantine/core";

import { gql } from "@/graphql";
import { useTeamStore } from "@/stores/teamStore";

const LIST_PROJECTS_FOR_SELECT = gql(`
  query ListProjectsForSelect($teamId: String!, $includeArchived: Boolean!) {
    listProjects(teamId: $teamId, includeArchived: $includeArchived, first: 50) {
      edges {
        node {
          isArchived
          name
          projectId
        }
      }
    }
  }
`);

type ProjectsSelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "data" | "error" | "label" | "placeholder"
>;

export function ProjectsSelect({ disabled, ...props }: ProjectsSelectProps) {
  const { selectedTeam } = useTeamStore();
  const { data, loading } = useQuery(LIST_PROJECTS_FOR_SELECT, {
    skip: !selectedTeam,
    variables: {
      includeArchived: true,
      teamId: selectedTeam ?? "",
    },
  });

  const projects = data?.listProjects?.edges ?? [];
  const hasNoProjects = !loading && projects.length === 0;

  return (
    <Select
      data={projects.map(({ node }) => ({
        disabled: !!node?.isArchived,
        label: node?.name ?? "",
        value: node?.projectId ?? "",
      }))}
      description={hasNoProjects ? "No projects exist on the selected team yet." : undefined}
      disabled={hasNoProjects || disabled || loading}
      label="Project"
      placeholder={loading ? "Loading…" : "Select a project"}
      {...props}
    />
  );
}
