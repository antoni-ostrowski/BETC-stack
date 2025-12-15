import { typedV } from "convex-helpers/validators"
import { defineSchema } from "convex/server"
import { tables } from "./generatedSchema"

// here you can define custom indexes
const authSchema = defineSchema({
  ...tables
})

export const authVv = typedV(authSchema)

export default authSchema
