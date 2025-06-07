export const paths = {
  auth: {
    login: {
      getPath: () => '/auth/login',
      path: '/auth/login',
    }
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
  }
};
