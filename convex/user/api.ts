import { GenericQueryCtx } from "convex/server"
import { Effect } from "effect"
import { DataModel, Id } from "../_generated/dataModel"
import { authComponent } from "../auth"
import { MyUser } from "../types"
import { DatabaseError, NotFound } from "../utils_effect"

export class UserApi extends Effect.Service<UserApi>()("UserApi", {
  effect: Effect.gen(function* () {
    return {
      getUser: Effect.fn(function* (
        ctx: GenericQueryCtx<DataModel>,
        userId: Id<"users">
      ) {
        const user = yield* Effect.tryPromise({
          try: async () => await ctx.db.get("users", userId),
          catch: () => new DatabaseError({ message: "Failed to get user" })
        })

        if (!user) return yield* new NotFound({ message: "User not found" })

        const authUser = yield* Effect.tryPromise({
          try: async () => await authComponent.getAnyUserById(ctx, user.authId),
          catch: () => new DatabaseError({ message: "Failed to get auth user" })
        })

        if (!authUser)
          return yield* new NotFound({ message: "Auth User not found" })

        return {
          ...user,
          authInfo: authUser
        } as MyUser
      })
    }
  })
}) {}
