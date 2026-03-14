import { getAuthUserIdentity, getHeaders } from "better-convex/auth"
import { typedV } from "convex-helpers/validators"
import { GenericQueryCtx } from "convex/server"
import { ConvexError } from "convex/values"
import { createBuilder } from "fluent-convex"
import { WithZod } from "fluent-convex/zod"

import { DataModel } from "./_generated/dataModel"
import { ServerError } from "./errors"
import { getAuth } from "./generated/auth"
import schema from "./schema"
import { effectifyFunc, effectifyPromise } from "./utils_effect"

export const vv = typedV(schema)
const convex = createBuilder<DataModel>()

const authMiddleware = convex
  .$context<GenericQueryCtx<DataModel>>()
  .createMiddleware(async (ctx, next) => {
    const identity = await getAuthUserIdentity(ctx)
    if (!identity) throw new ConvexError("Unauthorized")

    return next({
      ...ctx,
      userId: identity.userId
    })
  })

export const authedQuery = convex.query().extend(WithZod).use(authMiddleware)

export const authedMutation = convex.mutation().extend(WithZod).use(authMiddleware)

export const actionAuthMiddleware = convex.action().createMiddleware(async (ctx, next) => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new ConvexError("Unauthorized")

  return next({
    ...ctx,
    userId: identity.userId
  })
})

export const authedAction = convex.action().extend(WithZod).use(actionAuthMiddleware)

export function getUserAuth(ctx: GenericQueryCtx<DataModel>) {
  return effectifyPromise(
    async () => {
      return { auth: getAuth(ctx), headers: await getHeaders(ctx) }
    },
    () => new ServerError()
  )
}
