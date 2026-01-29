import "../lib/polar-polyfills"

import { CRPCError } from "better-convex/server"
import { zid } from "convex-helpers/server/zod4"
import { z } from "zod"
import { authAction, privateMutation, privateQuery } from "../lib/crpc"
import { getPolarClient } from "../lib/polar-client"
import { internal } from "./_generated/api"
import { subscriptionZod } from "./schema"

const subscriptionSchema = z.object({
  amount: z.number().nullish(),
  cancelAtPeriodEnd: z.boolean(),
  checkoutId: z.string().nullish(),
  createdAt: z.string(),
  currency: z.string().nullish(),
  currentPeriodEnd: z.string().nullish(),
  currentPeriodStart: z.string(),
  customerCancellationComment: z.string().nullish(),
  customerCancellationReason: z.string().nullish(),
  endedAt: z.string().nullish(),
  metadata: z.record(z.string(), z.unknown()),
  modifiedAt: z.string().nullish(),
  organizationId: zid("organization"),
  priceId: z.optional(z.string()),
  productId: z.string(),
  recurringInterval: z.string().nullish(),
  startedAt: z.string().nullish(),
  status: z.string(),
  subscriptionId: z.string(),
  userId: zid("user")
})

// Create subscription (called from webhook)
export const createSubscription = privateMutation
  .input(z.object({ subscription: subscriptionSchema }))
  .output(z.null())
  .mutation(async ({ ctx, input: args }) => {
    console.log("creating subscription")
    const existing = await ctx
      .table("subscriptions")
      .get("subscriptionId", args.subscription.subscriptionId)

    if (existing) {
      throw new CRPCError({
        code: "CONFLICT",
        message: `Subscription ${args.subscription.subscriptionId} already exists`
      })
    }

    console.log("creating subscription...")
    await ctx.table("subscriptions").insert(args.subscription)
    console.log("created subscription...")
    return null
  })

// Update subscription (called from webhook)
export const updateSubscription = privateMutation
  .input(z.object({ subscription: subscriptionZod }))
  .output(z.object({ updated: z.boolean() }))
  .mutation(async ({ ctx, input: args }) => {
    const existing = await ctx
      .table("subscriptions")
      .get("subscriptionId", args.subscription.subscriptionId)

    if (!existing) {
      return { updated: false }
    }

    await existing.patch(args.subscription)
    return { updated: true }
  })

// Get active subscription for user
export const getActiveSubscription = privateQuery
  .input(z.object({ userId: zid("user") }))
  .output(z.object({ subscriptionId: z.string() }).nullable())
  .query(async ({ ctx, input: args }) => {
    const subscription = await ctx
      .table("subscriptions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first()

    if (!subscription) return null

    return { subscriptionId: subscription.subscriptionId }
  })

// Cancel subscription (user action)
export const cancelSubscription = authAction
  .output(z.object({ success: z.boolean() }))
  .action(async ({ ctx }) => {
    const polar = getPolarClient()

    const subscription = await ctx.runQuery(
      internal.polarSubscription.getActiveSubscription,
      { userId: ctx.userId! }
    )

    if (!subscription) {
      throw new CRPCError({
        code: "PRECONDITION_FAILED",
        message: "No active subscription found"
      })
    }

    await polar.subscriptions.update({
      id: subscription.subscriptionId,
      subscriptionUpdate: { cancelAtPeriodEnd: true }
    })

    return { success: true }
  })

// Resume subscription (user action)
export const resumeSubscription = authAction
  .output(z.object({ success: z.boolean() }))
  .action(async ({ ctx }) => {
    const polar = getPolarClient()

    const subscription = await ctx.runQuery(
      internal.polarSubscription.getActiveSubscription,
      { userId: ctx.userId! }
    )

    if (!subscription) {
      throw new CRPCError({
        code: "PRECONDITION_FAILED",
        message: "No active subscription found"
      })
    }

    await polar.subscriptions.update({
      id: subscription.subscriptionId,
      subscriptionUpdate: { cancelAtPeriodEnd: false }
    })

    return { success: true }
  })
