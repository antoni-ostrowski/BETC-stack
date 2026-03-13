import { GenericCtx } from "@convex-dev/better-auth"
import { makeUseQueryWithStatus } from "convex-helpers/react"
import { useQueries } from "convex-helpers/react/cache"
import { typedV } from "convex-helpers/validators"
import { createBuilder } from "fluent-convex"
import { WithZod } from "fluent-convex/zod"
import { DataModel } from "./_generated/dataModel"
import { authComponent, createAuth } from "./auth"
import { MyUserId } from "./betterAuth/schema"
import schema from "./schema"
import { getAuthEff, getUserEff } from "./utils_effect"

export const useQuery = makeUseQueryWithStatus(useQueries)
export const vv = typedV(schema)

const convex = createBuilder<DataModel>()

export const authMiddleware = convex
  .$context<GenericCtx<DataModel>>()
  .createMiddleware(async (context, next) => {
    const identity = await context.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    return next({
      ...context,
      userId: identity.subject as MyUserId,
      userIdentity: identity,
      getUserAsync,
      getAuthAsync,
      getAuth: getAuthEff(() => getAuthAsync(context)),
      getUser: getUserEff(() => getUserAsync(context))
    })
  })

export const authedQuery = convex.query().extend(WithZod).use(authMiddleware)

export const authedMutation = convex
  .mutation()
  .extend(WithZod)
  .use(authMiddleware)

export const authedAction = convex.action().extend(WithZod).use(authMiddleware)

export async function getAuthAsync(ctx: GenericCtx<DataModel>) {
  return await authComponent.getAuth(createAuth, ctx)
}

export async function getUserAsync(ctx: GenericCtx<DataModel>) {
  return await authComponent.getAuthUser(ctx)
}
