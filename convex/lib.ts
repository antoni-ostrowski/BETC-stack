import { GenericCtx } from "@convex-dev/better-auth"
import { makeUseQueryWithStatus } from "convex-helpers/react"
import { useQueries } from "convex-helpers/react/cache"
import {
  customAction,
  customCtx,
  customMutation,
  customQuery
} from "convex-helpers/server/customFunctions"
import { typedV } from "convex-helpers/validators"
import { DataModel } from "./_generated/dataModel"
import { action, mutation, query } from "./_generated/server"
import { authComponent, createAuth } from "./auth"
import schema from "./schema"

export const useQuery = makeUseQueryWithStatus(useQueries)

export const vv = typedV(schema)

async function createAuthCtx(ctx: GenericCtx<DataModel>) {
  const user = await authComponent.getAuthUser(ctx)
  const auth = await authComponent.getAuth(createAuth, ctx)

  return {
    ...ctx,
    auth: { ...auth, user }
  }
}

export const authQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    return await createAuthCtx(ctx)
  })
)

export const authMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    return await createAuthCtx(ctx)
  })
)

export const authAction = customAction(
  action,
  customCtx(async (ctx) => {
    return await createAuthCtx(ctx)
  })
)
