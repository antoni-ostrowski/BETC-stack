import { organization } from "better-auth/plugins"
import { convex } from "better-convex/auth"

import { api } from "./_generated/api"
import authConfig from "./auth.config"
import { defineAuth } from "./generated/auth"

export default defineAuth((_ctx) => ({
  baseURL: process.env.SITE_URL!,
  emailAndPassword: { enabled: true },
  plugins: [
    convex({
      authConfig,
      jwks: process.env.JWKS
    }),
    organization({
      allowUserToCreateOrganization: true
    })
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24 * 15
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ""
    }
  },

  triggers: {
    user: {
      create: {
        before: async (data, triggerCtx) => {
          // here create user personal org
          return { data }
        },
        after: async (user, triggerCtx) => {}
      }
    }
  }
}))
