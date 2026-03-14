import { authedQuery } from "../lib"
import { appRuntime } from "../runtime"
import { getUserById, runEffOrThrow } from "../utils_effect"

export const getMe = authedQuery
  .handler(async (ctx) => {
    return await runEffOrThrow(appRuntime, getUserById(ctx, ctx.userId))
  })
  .public()
