import z from "zod"
import { authQuery } from "../../lib/crpc"
import { DatabaseError, effectifyPromise } from "../../lib/lib"
import { appRuntime } from "../../lib/runtime"
import { todoZod } from "../schema"

export const list = authQuery
  .output(z.array(todoZod))
  .query(async ({ ctx }) => {
    const program = effectifyPromise(
      () => ctx.table("todo").docs(),
      (a) => new DatabaseError(a)
    )
    return await appRuntime.runPromise(program)
  })
