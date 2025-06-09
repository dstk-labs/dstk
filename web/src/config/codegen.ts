import type { CodegenConfig } from '@graphql-codegen/cli';
import { API_URL } from './env';

const config: CodegenConfig = {
  schema: API_URL,
  documents: ['src/**/*{.ts,.tsx}'],
  generates: {
    './src/graphql/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql'
      },
      // Add this config block to instruct the underlying typescript plugin
      // to generate enums as string literal union types.
      config: {
        enumsAsTypes: true
      }
    },
    './src/graphql/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
      // Also apply the same config here for consistency
      config: {
        enumsAsTypes: true
      }
    },
  },
  ignoreNoDocuments: true,
};

export default config;
