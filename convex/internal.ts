import { v } from "convex/values"
import { internalQuery } from "./_generated/server"

export const getCurrentUserInternal = internalQuery({
  args: { authId: v.string() },
  handler: async (ctx, { authId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", authId))
      .first()
  }
})
