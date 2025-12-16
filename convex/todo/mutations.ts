import { v } from "convex/values"
import { Effect } from "effect"
import { mutation } from "../_generated/server"
import { appRuntime, runEffOrThrow } from "../utils_effect"
import { TodoApi } from "./api"

export const toggle = mutation({
  args: { id: v.id("todos") },
  handler: async ({ db }, { id }) => {
    const program = Effect.gen(function* () {
      const todoApi = yield* TodoApi
      const todo = yield* todoApi.getTodo({ db, todoId: id })
      yield* todoApi.toggleTodo({ db, todo })
    }).pipe(Effect.tapError((err) => Effect.logError(err)))

    return await runEffOrThrow(appRuntime, program)
  }
})
