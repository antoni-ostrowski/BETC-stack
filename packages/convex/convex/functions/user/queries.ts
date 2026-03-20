import { appRuntime } from "../../runtime"
import { getUserById, runEffOrThrow } from "../../utils"
import { authedQuery } from "../lib"

export const getMe = authedQuery
  .handler(async (ctx) => {
    return await runEffOrThrow(appRuntime, getUserById(ctx, ctx.userId))
  })
  .public()
