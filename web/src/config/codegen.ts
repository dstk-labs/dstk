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
      }
    },
    './src/graphql/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
