
import dotenv from 'dotenv';
import type { CodegenConfig } from '@graphql-codegen/cli';

dotenv.config({ path: '.env.local' });

const SHOP_API_URL = process.env.VENDURE_SHOP_API_URL;

if (!SHOP_API_URL) {
    throw new Error('VENDURE_SHOP_API_URL is not defined');
}

const config: CodegenConfig = {
  schema: [
    {
      [process.env.VENDURE_SHOP_API_URL!]: {
        headers: {
          'Content-Type': 'application/json',
          'vendure-token': 'jnnqg705gd9heroj6yl',
        },
      },
    },
  ],
  documents: ['src/**/*.graphql', 'src/**/*.ts', 'src/**/*.tsx'],
  generates: {
    './src/graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
    },
  },
};

export default config;
