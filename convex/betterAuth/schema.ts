import { typedV } from "convex-helpers/validators"
import { defineSchema } from "convex/server"
import { tables } from "./generatedSchema"

const authSchema = defineSchema({
  ...tables,
})

export const authVv = typedV(authSchema)

export default authSchema
