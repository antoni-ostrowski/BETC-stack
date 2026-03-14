import { Effect } from "effect"
import { z } from "zod"

import { Id } from "../_generated/dataModel"
import { DatabaseError } from "../errors"
import { getAuth } from "../generated/auth"
import { authedMutation } from "../lib"
import { appRuntime } from "../runtime"
import { effectifyPromise, runEffOrThrow } from "../utils_effect"

export const toggle = authedMutation
  .input(z.object({ id: z.string() }))
  .handler(async (ctx, { id }) => {
    const program = Effect.gen(function* () {
      const todo = yield* effectifyPromise(
        () => ctx.db.get(id as Id<"todos">),
        (a) => new DatabaseError(a)
      )
      if (!todo) throw new Error("Todo not found")
      yield* effectifyPromise(
        () => ctx.db.patch(todo._id, { completed: !todo.completed }),
        (a) => new DatabaseError(a)
      )
    })

    await runEffOrThrow(appRuntime, program)
  })
  .public()

export const create = authedMutation
  .input(z.object({ text: z.string() }))
  .handler(async ({ db, userId }, { text }) => {
    const program = Effect.gen(function* () {
      yield* effectifyPromise(
        () => db.insert("todos", { text, completed: true, userId }),
        (a) => new DatabaseError(a)
      )
    })

    await runEffOrThrow(appRuntime, program)
  })
  .public()

export const remove = authedMutation
  .input(z.object({ todoId: z.string() }))
  .handler(async ({ db }, { todoId }) => {
    const program = Effect.gen(function* () {
      yield* effectifyPromise(
        () => db.delete(todoId as Id<"todos">),
        (a) => new DatabaseError(a)
      )
    })

    await runEffOrThrow(appRuntime, program)
  })
  .public()
