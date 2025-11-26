import {
  AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { components, internal } from "./_generated/api"
import { DataModel, Id } from "./_generated/dataModel"
import { betterAuth } from "better-auth"
import authSchema from "./betterAuth/schema"

const siteUrl = process.env.SITE_URL

const authFunctions: AuthFunctions = internal.auth

export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
    authFunctions,
    triggers: {
      user: {
        onCreate: async (ctx, authUser) => {
          await ctx.db.insert("users", {
            authId: authUser._id,
          })
        },
        onDelete: async (ctx, authUser) => {
          const user = await ctx.db.get(authUser.userId as Id<"users">)
          if (!user) {
            return
          }
          await ctx.db.delete(user._id)
        },
      },
    },
  },
)

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi()

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    logger: {
      disabled: optionsOnly,
    },
    account: {
      accountLinking: {
        enabled: true,
      },
    },

    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      autoSignIn: true,
    },

    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
    },
    plugins: [convex()],
  })
}
