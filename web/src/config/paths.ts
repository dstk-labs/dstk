export const paths = {
  auth: {
    login: {
      getPath: () => "/auth/login",
      path: "/auth/login",
    },
    register: {
      getPath: () => "/auth/register",
      path: "/auth/register",
    },
  },
  dashboard: {
    deployments: {
      getPath: () => "/dashboard/deployments",
      path: "/dashboard/deployments",
    },
    model: {
      getPath: (modelId: string) => `/dashboard/models/${modelId}`,
      path: "/dashboard/models/:modelId",
    },
    models: {
      getPath: () => "/dashboard/models",
      path: "/dashboard/models",
    },
    modelVersionArtifacts: {
      getPath: (modelId: string, modelVersionId: string) =>
        `/dashboard/models/${modelId}/${modelVersionId}/artifacts`,
      path: "/dashboard/models/:modelId/:modelVersionId/artifacts",
    },
    modelVersionCard: {
      getPath: (modelId: string, modelVersionId: string) =>
        `/dashboard/models/${modelId}/${modelVersionId}/card`,
      path: "/dashboard/models/:modelId/:modelVersionId/card",
    },
    modelVersionLogs: {
      getPath: (modelId: string, modelVersionId: string) =>
        `/dashboard/models/${modelId}/${modelVersionId}/logs`,
      path: "/dashboard/models/:modelId/:modelVersionId/logs",
    },
    overview: {
      getPath: () => "/dashboard/overview",
      path: "/dashboard/overview",
    },
    project: {
      getPath: (projectId: string) => `/dashboard/projects/${projectId}`,
      path: "/dashboard/projects/:projectId",
    },
    projects: {
      getPath: () => "/dashboard/projects",
      path: "/dashboard/projects",
    },
    settings: {
      getPath: () => "/dashboard/settings",
      path: "/dashboard/settings",
    },
    storage: {
      getPath: () => "/dashboard/storage",
      path: "/dashboard/storage",
    },
    storageItem: {
      getPath: (providerId: string) => `/dashboard/storage/${providerId}`,
      path: "/dashboard/storage/:providerId",
    },
    team: {
      getPath: (teamId: string) => `/dashboard/teams/${teamId}`,
      path: "/dashboard/teams/:teamId",
    },
    teams: {
      getPath: () => "/dashboard/teams",
      path: "/dashboard/teams",
    },
  },
  root: {
    about: {
      getPath: () => "/about",
      path: "/about",
    },
    careers: {
      getPath: () => "/careers",
      path: "/careers",
    },
    landing: {
      getPath: () => "/",
      path: "/",
    },
    privacy: {
      getPath: () => "/privacy",
      path: "/privacy",
    },
    terms: {
      getPath: () => "/terms",
      path: "/terms",
    },
  },
};
