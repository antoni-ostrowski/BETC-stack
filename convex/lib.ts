import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions"
import { action, internalQuery, mutation, query } from "./_generated/server"
import { authComponent, createAuth } from "./auth"
import { Id } from "./betterAuth/_generated/dataModel"
import { GenericCtx } from "@convex-dev/better-auth"
import { makeUseQueryWithStatus } from "convex-helpers/react"
import { useQueries } from "convex/react"
import { typedV } from "convex-helpers/validators"
import { DataModel, Doc } from "./_generated/dataModel"
import schema from "./schema"
import { internal } from "./_generated/api"
import { ConvexError } from "convex/values"

export const useQuery = makeUseQueryWithStatus(useQueries)

export const vv = typedV(schema)

async function createAuthCtx(ctx: GenericCtx<DataModel>) {
  const authUser = await authComponent.getAuthUser(ctx)

  const user = (await ctx.runQuery(internal.internal.getCurrentUserInternal, {
    authId: authUser._id,
  })) as Doc<"users"> | null
  if (user === null) {
    throw new ConvexError("No user found")
  }

  const auth = await authComponent.getAuth(createAuth, ctx)

  const getAnyUserByIdOrThrow = async (userId: Id<"user">) => {
    return await authComponent.getAnyUserById(ctx, userId)
  }

  return {
    ...ctx,
    auth: { ...auth, user, authUser, getAnyUserByIdOrThrow },
  }
}

export const authQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    return await createAuthCtx(ctx)
    // return {}
  }),
)

export const authMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    return await createAuthCtx(ctx)
  }),
)

export const authAction = customAction(
  action,
  customCtx(async (ctx) => {
    return await createAuthCtx(ctx)
  }),
)
