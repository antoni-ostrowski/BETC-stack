import { authedQuery } from "../lib"
import { appRuntime } from "../runtime"
import { getUserFromCtx, runEffOrThrow } from "../utils_effect"

export const getMe = authedQuery
  .handler(async (ctx) => {
    return await runEffOrThrow(appRuntime, getUserFromCtx(ctx, ctx.userId))
  })
  .public()
