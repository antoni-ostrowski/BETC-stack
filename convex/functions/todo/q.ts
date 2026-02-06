import { Effect } from "effect"
import z from "zod"
import { authQuery } from "../../lib/crpc"
import {
  DatabaseError,
  effectifyPromise,
  execEff,
  ServerError
} from "../../lib/lib"
import { appRuntime } from "../../lib/runtime"
import { todoZod } from "../schema"

export const list = authQuery
  .output(z.array(todoZod))
  .query(async ({ ctx }) => {
    const program = Effect.gen(function* () {
      // special convex service wrapper, that gives access
      // to convex ctx, executes promise and fails with DatabaseError,
      // can take custom err message
      const example1 = yield* ctx.effQuery(
        async (c) => c.table("todo").docs(),
        "custom err message"
      )

      // wrap default error to specific one
      const example2 = yield* ctx
        .effQuery(async (c) => c.table("todo").docs())
        .pipe(
          Effect.mapError(
            (dbError) =>
              new ServerError({ message: "another custom err message" })
          )
        )

      // general purpose promise wrapper, works with any promise,
      // allows to associate specific error to that promise
      const example3 = yield* effectifyPromise(
        () => ctx.table("todo").docs(),
        ({ cause, message }) => new DatabaseError({ cause, message }),
        "custom err message"
      )

      return example1
    })
    // exec program, throw crpc error if program fails
    return await execEff(ctx, appRuntime, program)
  })
