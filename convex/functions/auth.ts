import "../lib/polar-polyfills"

import { convex } from "@convex-dev/better-auth/plugins"
import { ac, roles } from "@convex/auth-shared"
import { checkout, polar, portal, usage, webhooks } from "@polar-sh/better-auth"
import { Polar } from "@polar-sh/sdk"
import { betterAuth, type BetterAuthOptions } from "better-auth"
import { organization } from "better-auth/plugins"
import { createApi, createClient, type AuthFunctions } from "better-convex/auth"
import { getPolarClient } from "../lib/polar-client"
import { convertToDatabaseSubscription } from "../lib/polar-helpers"
import { internal } from "./_generated/api"
import type { DataModel, Id } from "./_generated/dataModel"
import type { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server"
import authConfig from "./auth.config"
import { createPersonalOrganization } from "./organization"
import schema from "./schema"

type GenericCtx = QueryCtx | MutationCtx | ActionCtx
const authFunctions: AuthFunctions = internal.auth

export type Auth = ReturnType<typeof createAuth>
// Create client with Convex adapter and triggers
export const authClient = createClient<DataModel, typeof schema>({
  authFunctions,
  schema,
  triggers: {
    user: {
      onCreate: async (ctx, user) => {
        // Create personal organization for the new user
        await createPersonalOrganization(ctx, {
          email: user.email,
          image: user.image || null,
          name: user.name,
          userId: user._id
        })

        // Create Polar customer for the new user
        await ctx.scheduler.runAfter(0, internal.polarCustomer.createCustomer, {
          email: user.email,
          name: user.name,
          userId: user._id
        })
      }
    }
  }
})

// Auth options factory
export const createAuthOptions = (ctx: GenericCtx) =>
  ({
    baseURL: process.env.SITE_URL ?? "http://localhost:3000",
    database: authClient.httpAdapter(ctx),
    user: {
      deleteUser: {
        enabled: true,
        afterDelete: async (user) => {
          const polar = getPolarClient()
          await polar.customers.deleteExternal({
            externalId: user.id
          })
        }
      }
    },
    plugins: [
      convex({
        authConfig,
        jwks: process.env.JWKS
      }),
      organization({
        allowUserToCreateOrganization: true,
        organizationLimit: 5,
        membershipLimit: 100,
        creatorRole: "owner",
        invitationExpiresIn: 48 * 60 * 60, // 48 hours
        ac,
        roles,
        teams: {
          enabled: true,
          maximumTeams: 10
        }
      }),
      polar({
        client: new Polar({
          accessToken: process.env.POLAR_ACCESS_TOKEN!, // oxlint-disable-line
          server:
            process.env.POLAR_SERVER === "production" ? "production" : "sandbox"
        }),
        // Customer creation via scheduler (recommended for Convex)
        // createCustomerOnSignUp: true, // Use trigger instead
        use: [
          checkout({
            authenticatedUsersOnly: true,
            products: [
              {
                productId: "9ba72033-f43e-4eb2-b74a-2c32d9465866",
                slug: "pro"
              }
            ],
            successUrl: `${process.env.SITE_URL}/success?checkout_id={CHECKOUT_ID}`,
            theme: "dark"
          }),
          portal(),
          usage(),
          webhooks({
            secret: process.env.POLAR_WEBHOOK_SECRET!, // oxlint-disable-line
            onCustomerCreated: async (payload) => {
              const userId = payload?.data.externalId
              if (!userId) return

              await (ctx as ActionCtx).runMutation(
                internal.polarCustomer.updateUserPolarCustomerId,
                { customerId: payload.data.id, userId: userId as Id<"user"> }
              )
            },
            onSubscriptionCreated: async (payload) => {
              console.log("on sub created hook start")
              console.log({ payload })
              if (!payload.data.customer.externalId) return
              console.log("on subscription created hook")

              await (ctx as ActionCtx).runMutation(
                internal.polarSubscription.createSubscription,
                { subscription: convertToDatabaseSubscription(payload.data) }
              )
            },
            onSubscriptionUpdated: async (payload) => {
              if (!payload.data.customer.externalId) return

              await (ctx as ActionCtx).runMutation(
                internal.polarSubscription.updateSubscription,
                { subscription: convertToDatabaseSubscription(payload.data) }
              )
            }
          })
        ]
      })
    ],

    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24 * 15 // 15 days
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID ?? "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ""
      }
    },
    // Fallback for CLI schema generation
    trustedOrigins: [process.env.SITE_URL ?? "http://localhost:3000"]
  }) satisfies BetterAuthOptions

// Create auth instance for HTTP routes
export const createAuth = (ctx: GenericCtx) =>
  betterAuth(createAuthOptions(ctx))

// IMPORTANT: Use getAuth for queries/mutations (direct DB access)
export const getAuth = <Ctx extends QueryCtx | MutationCtx>(ctx: Ctx) => {
  return betterAuth({
    ...createAuthOptions(ctx),
    database: authClient.adapter(ctx, createAuthOptions)
  })
}

// Export trigger handlers for Convex
export const {
  beforeCreate,
  beforeDelete,
  beforeUpdate,
  onCreate,
  onDelete,
  onUpdate
} = authClient.triggersApi()

// Export CRUD functions for Better Auth
export const {
  create,
  deleteMany,
  deleteOne,
  findMany,
  findOne,
  updateMany,
  updateOne,
  getLatestJwks,
  rotateKeys
} = createApi(schema, createAuth, {
  skipValidation: true // Smaller generated types
})

export const auth = betterAuth(createAuthOptions({} as any)) // oxlint-disable-line
