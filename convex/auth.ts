import {
  AuthFunctions,
  createClient,
  type GenericCtx
} from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { checkout, polar, portal } from "@polar-sh/better-auth"
import { Polar } from "@polar-sh/sdk"
import { betterAuth, BetterAuthOptions } from "better-auth"
import { api, components, internal } from "./_generated/api"
import { DataModel, Id } from "./_generated/dataModel"
import authConfig from "./auth.config"
import authSchema from "./betterAuth/schema"

const siteUrl = process.env.SITE_URL

const authFunctions: AuthFunctions = internal.auth

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox"
})

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    logger: {
      level: "error"
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string
      }
    },
    user: {
      deleteUser: {
        enabled: true,
        afterDelete: async (user, _request) => {
          await polarClient.customers.deleteExternal({
            externalId: user.id
          })
        }
      }
    },
    plugins: [
      polar({
        client: polarClient,
        createCustomerOnSignUp: true,
        use: [
          checkout({
            theme: "dark",
            products: [
              {
                productId: "24629f61-995d-4a9d-b1bb-7b060fb5327a",
                slug: "test-product" // Custom slug for easy reference in Checkout URL, e.g. /checkout/test-product
              }
            ],
            successUrl: process.env.POLAR_SUCCESS_URL,
            authenticatedUsersOnly: true,
            returnUrl: process.env.SITE_URL
          }),
          portal({
            returnUrl: process.env.SITE_URL // An optional URL which renders a back-button in the Customer Portal
          })
        ]
      }),
      convex({
        authConfig,
        jwksRotateOnTokenGenerationError: true
      })
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
          const userId = await ctx.db.insert("users", {
            authId: authUser._id
          })

          await ctx.scheduler.runAfter(0, api.analytics.captureEvent, {
            distinctId: userId,
            entry: {
              type: "identify",
              properties: {
                email: authUser.email,
                name: authUser.name
              },
              event: "$identify"
            }
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
