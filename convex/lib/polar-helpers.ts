import type { Subscription } from "@polar-sh/sdk/models/components/subscription"
import type { WithoutSystemFields } from "convex/server"
import type { Doc, Id } from "../functions/_generated/dataModel"

export const convertToDatabaseSubscription = (
  subscription: Subscription
): WithoutSystemFields<Doc<"subscriptions">> => {
  // Extract organizationId from subscription metadata (referenceId)
  const organizationId = subscription.metadata
    ?.referenceId as Id<"organization">

  if (!organizationId) {
    throw new Error(
      "Subscription missing organizationId in metadata.referenceId"
    )
  }

  return {
    amount: subscription.amount,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    checkoutId: subscription.checkoutId,
    createdAt: subscription.createdAt.toISOString(),
    currency: subscription.currency,
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
    currentPeriodStart: subscription.currentPeriodStart.toISOString(),
    customerCancellationComment: subscription.customerCancellationComment,
    customerCancellationReason: subscription.customerCancellationReason,
    endedAt: subscription.endedAt?.toISOString() ?? null,
    metadata: subscription.metadata ?? {},
    modifiedAt: subscription.modifiedAt?.toISOString() ?? null,
    organizationId,
    productId: subscription.productId,
    recurringInterval: subscription.recurringInterval,
    startedAt: subscription.startedAt?.toISOString() ?? null,
    status: subscription.status,
    subscriptionId: subscription.id,
    userId: subscription.customer.externalId as Id<"user">
  }
}
