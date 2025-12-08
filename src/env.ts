import { createEnv } from "@t3-oss/env-core"
import { Schema } from "effect"

export const env = createEnv({
  server: {
    GITHUB_CLIENT_ID: Schema.standardSchemaV1(Schema.String),
    GITHUB_CLIENT_SECRET: Schema.standardSchemaV1(Schema.String),
  },
  clientPrefix: "VITE_",

  client: {
    VITE_CONVEX_URL: Schema.standardSchemaV1(Schema.String),
    VITE_CONVEX_SITE_URL: Schema.standardSchemaV1(Schema.String),
    VITE_SITE_URL: Schema.standardSchemaV1(Schema.String),
  },

  runtimeEnv: {
    ...process.env,
    ...import.meta.env,
  },
  emptyStringAsUndefined: true,
})
