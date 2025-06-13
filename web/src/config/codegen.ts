import type { CodegenConfig } from '@graphql-codegen/cli';

import { API_URL } from './env';

const config: CodegenConfig = {
  documents: ['src/**/*{.ts,.tsx}'],
  generates: {
    './src/graphql/': {
      // Add this config block to instruct the underlying typescript plugin
      // to generate enums as string literal union types.
      config: {
        enumsAsTypes: true,
      },
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
    './src/graphql/types.ts': {
      // Also apply the same config here for consistency
      config: {
        enumsAsTypes: true,
      },
      plugins: ['typescript', 'typescript-operations'],
    },
  },
  ignoreNoDocuments: true,
  schema: API_URL,
};

export default config;
