import { getUserById, runEffOrThrow } from "../../utils"
import { authedQuery } from "../lib"
import { appRuntime } from "../runtime"

export const getMe = authedQuery
  .handler(async (ctx) => {
    return await runEffOrThrow(appRuntime, getUserById(ctx, ctx.userId))
  })
  .public()
