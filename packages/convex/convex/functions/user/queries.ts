import { authedQuery } from "../lib"

export const getMe = authedQuery
  .handler(async (ctx) => {
    return { ...(await ctx.db.get(ctx.userId)) }
  })
  .public()
