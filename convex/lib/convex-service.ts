import { Context, Effect, Layer } from "effect"
import { EntsMutationCtx, EntsQueryCtx } from "./ents"
import { DatabaseError } from "./lib"

export class ConvexCtx extends Context.Tag("ConvexCtx")<
  ConvexCtx,
  EntsQueryCtx | EntsMutationCtx
>() {}

export class ConvexQueryCtx extends Context.Tag("ConvexQueryCtx")<
  ConvexQueryCtx,
  EntsQueryCtx
>() {}
export class ConvexMutationCtx extends Context.Tag("ConvexMutationCtx")<
  ConvexMutationCtx,
  EntsMutationCtx
>() {}

const make = Effect.gen(function* () {
  return {
    query: <A>(
      fn: (ctx: EntsQueryCtx) => Promise<A>,
      errMess: string = "failed to perform database operation"
    ) =>
      Effect.gen(function* () {
        const ctx = yield* ConvexQueryCtx
        return yield* Effect.tryPromise({
          try: async () => fn(ctx),
          catch: (cause) =>
            new DatabaseError({
              cause,
              message: errMess
            })
        })
      }),
    mutate: <A>(
      fn: (ctx: EntsMutationCtx) => Promise<A>,
      errMess: string = "failed to perform database operation"
    ) =>
      Effect.gen(function* () {
        const ctx = yield* ConvexMutationCtx
        return yield* Effect.tryPromise({
          try: async () => fn(ctx),
          catch: (cause) =>
            new DatabaseError({
              cause,
              message: errMess
            })
        })
      })
  }
})

export class MyConvex extends Context.Tag("MyConvex")<
  MyConvex,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make)
}
