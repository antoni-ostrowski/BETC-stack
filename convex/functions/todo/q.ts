import { authQuery } from "../../lib/crpc"
import { DatabaseError, effectifyPromise } from "../../lib/lib"
import { appRuntime } from "../../lib/runtime"

export const list = authQuery.query(async ({ ctx }) => {
  const program = effectifyPromise(
    () => ctx.table("todo"),
    (cause, message) => new DatabaseError({ cause, message })
  )
  return await appRuntime.runPromise(program)
})
