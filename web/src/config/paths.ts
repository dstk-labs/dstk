export const paths = {
  auth: {
    login: {
      getPath: () => '/auth/login',
      path: '/auth/login',
    },
    register: {
      getPath: () => '/auth/register',
      path: '/auth/register',
    },
  },
  dashboard: {
    deployments: {
      getPath: () => '/dashboard/deployments',
      path: '/dashboard/deployments',
    },
    models: {
      getPath: () => '/dashboard/models',
      path: '/dashboard/models',
    },
    overview: {
      getPath: () => '/dashboard/overview',
      path: '/dashboard/overview',
    },
    project: {
      getPath: (projectId: string) => `/dashboard/projects/${projectId}`,
      path: '/dashboard/projects/:projectId',
    },
    projects: {
      getPath: () => '/dashboard/projects',
      path: '/dashboard/projects',
    },
    settings: {
      getPath: () => '/dashboard/settings',
      path: '/dashboard/settings',
    },
    storage: {
      getPath: () => '/dashboard/storage',
      path: '/dashboard/storage',
    },
    storageItem: {
      getPath: (providerId: string) => `/dashboard/storage/${providerId}`,
      path: '/dashboard/storage/:providerId',
    },
    teams: {
      getPath: () => '/dashboard/teams',
      path: '/dashboard/teams',
    },
  },
  root: {
    about: {
      getPath: () => '/about',
      path: '/about',
    },
    careers: {
      getPath: () => '/careers',
      path: '/careers',
    },
    landing: {
      getPath: () => '/',
      path: '/',
    },
    privacy: {
      getPath: () => '/privacy',
      path: '/privacy',
    },
    terms: {
      getPath: () => '/terms',
      path: '/terms',
    },
  },
};
