import { zid } from "convex-helpers/server/zod4"
import { Effect } from "effect"
import z from "zod"
import { authMutation } from "../../lib/crpc"
import { execEff, NotFoundError } from "../../lib/lib"
import { appRuntime } from "../../lib/runtime"

export const toggle = authMutation
  .input(z.object({ id: zid("todo") }))
  .mutation(async ({ ctx, input }) => {
    const program = Effect.gen(function* () {
      const todo = yield* ctx.effMutate(async (a) =>
        a.table("todo").get(input.id)
      )

      if (!todo) return yield* new NotFoundError({ message: "todo not found" })

      return yield* ctx.effMutate(async (a) =>
        a.table("todo").getX(todo._id).patch({ completed: !todo.completed })
      )
    })
    return await execEff(ctx, appRuntime, program)
  })

export const create = authMutation
  .input(z.object({ text: z.string() }))
  .mutation(async ({ ctx, input: { text } }) => {
    const program = ctx.effMutate(async (c) =>
      c.table("todo").insert({ text, completed: false, userId: ctx.user.id })
    )
    return await execEff(ctx, appRuntime, program)
  })

export const remove = authMutation
  .input(z.object({ todoId: zid("todo") }))
  .mutation(async ({ ctx, input: { todoId } }) => {
    const program = ctx.effMutate(async (a) =>
      a.table("todo").getX(todoId).delete()
    )
    return await execEff(ctx, appRuntime, program)
  })
