import { defineSchema, defineTable } from "convex/server"
import { tables } from "./generatedSchema"

const authSchema = defineSchema({
  ...tables,
})

export default authSchema
