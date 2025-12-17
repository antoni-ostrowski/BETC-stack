import {
  AuthFunctions,
  createClient,
  type GenericCtx
} from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { betterAuth, BetterAuthOptions } from "better-auth"
import { components, internal } from "./_generated/api"
import { DataModel, Id } from "./_generated/dataModel"
import authConfig from "./auth.config"
import authSchema from "./betterAuth/schema"

const siteUrl = process.env.SITE_URL

const authFunctions: AuthFunctions = internal.auth

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string
      }
    },
    plugins: [
      convex({
        authConfig,
        jwksRotateOnTokenGenerationError: true
      })
      // tanstackStartCookies()
    ]
  } satisfies BetterAuthOptions
}

export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema
    },
    verbose: true,
    authFunctions,
    triggers: {
      // here you can define triggers to update the user profiles in your app db,
      // but I prefer just storing the authId and fetching the auth data when needed
      // so thats why this is so simple
      user: {
        onCreate: async (ctx, authUser) => {
          await ctx.db.insert("users", {
            authId: authUser._id
          })
        },
        onDelete: async (ctx, authUser) => {
          const user = await ctx.db.get(authUser.userId as Id<"users">)
          if (!user) {
            return
          }
          await ctx.db.delete(user._id)
        }
      }
    }
  }
)

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi()
export const { getAuthUser } = authComponent.clientApi()

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx))
}
