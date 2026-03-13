import { authedQuery } from "../lib"

export const getMe = authedQuery.handler(async (ctx) => {
  return { ...(await ctx.getUserAsync(ctx)) }
})
