import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * Types every query in the dashboard against the API's schema file (../Solu/schema.gql, written
 * by the API when it starts). `npm run codegen` after an API change.
 */
const config: CodegenConfig = {
  schema: process.env.SOLU_SCHEMA ?? "../Solu/schema.gql",
  documents: ["src/**/*.{ts,tsx}", "!src/lib/gql/**/*"],
  ignoreNoDocuments: true,
  generates: {
    "./src/lib/gql/": {
      preset: "client",
      config: {
        documentMode: "string",
        enumsAsTypes: true,
        useTypeImports: true,
        scalars: { DateTime: "string", JSON: "unknown" },
      },
      presetConfig: { fragmentMasking: false },
    },
  },
};

export default config;
