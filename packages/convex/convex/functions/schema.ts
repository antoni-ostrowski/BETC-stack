import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

import authSchema from "./authSchema"

export default defineSchema({
  ...authSchema.tables,
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    userId: v.string()
  }).index("userId", ["userId"])
})
