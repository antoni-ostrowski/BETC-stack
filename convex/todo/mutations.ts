import { v } from "convex/values"
import { Effect } from "effect"
import { mutation } from "../_generated/server"
import { appRuntime, matchExit } from "../utils_effect"
import { TodoApi } from "./api"

export const toggle = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, { id }) => {
    const result = await appRuntime.runPromiseExit(
      Effect.gen(function* () {
        const todoApi = yield* TodoApi
        const todo = yield* todoApi.getTodo({ db: ctx.db, todoId: id })
        yield* todoApi.toggleTodo({ db: ctx.db, todo })
      }).pipe(Effect.tapError((err) => Effect.logError(err)))
    )

    return await matchExit(result)
  }
})
