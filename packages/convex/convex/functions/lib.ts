import { getAuthUserIdentity } from "better-convex/auth"
import { typedV } from "convex-helpers/validators"
import { GenericMutationCtx } from "convex/server"
import { ConvexError } from "convex/values"
import { createBuilder } from "fluent-convex"
import { WithZod } from "fluent-convex/zod"

import { DataModel } from "./_generated/dataModel"
import { getAuth } from "./generated/auth"
import type { GenericCtx } from "./generated/server"
import { triggers } from "./my_triggers"
import schema from "./schema"

export const vv = typedV(schema)
const convex = createBuilder<DataModel>()

const withAuth = convex
  .$context<GenericMutationCtx<DataModel>>()
  .createMiddleware(async (ctx, next) => {
    const identity = await getAuthUserIdentity(ctx)
    if (!identity) throw new ConvexError("Unauthorized")

    return next({
      ...ctx,
      userId: identity.userId
    })
  })

export const withTriggers = convex
  .$context<GenericMutationCtx<DataModel>>()
  .createMiddleware(async (ctx, next) => {
    return next(triggers.wrapDB(ctx))
  })

export const query = convex.query().extend(WithZod)
export const authedQuery = convex.query().extend(WithZod).use(withAuth)

export const mutation = convex.mutation().extend(WithZod)
export const authedMutation = convex.mutation().extend(WithZod).use(withAuth)

export const action = convex.action().extend(WithZod)
export const actionAuthMiddleware = convex.action().createMiddleware(async (ctx, next) => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new ConvexError("Unauthorized")

  return next({
    ...ctx,
    userId: identity.userId
  })
})

export const authedAction = convex.action().extend(WithZod).use(actionAuthMiddleware)
