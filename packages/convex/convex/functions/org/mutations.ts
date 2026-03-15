import { Effect } from "effect"
import { z } from "zod/v4"

import { DatabaseError, ServerError } from "../errors"
import { mutation } from "../lib"
import { appRuntime } from "../runtime"
import { effectifyPromise, getUserAuth, runEffOrThrow } from "../utils_effect"

function generateSlug(name: string) {
  return name.slice(0, name.length / 2)
}

export const create = mutation
  .input(
    z.object({
      name: z.string()
    })
  )
  .handler(async (ctx, args) => {
    console.log("runnign org creation")
    const program = Effect.gen(function* () {
      const { auth, headers } = yield* getUserAuth(ctx)
      const org = yield* effectifyPromise(
        async () =>
          auth.api.createOrganization({
            body: {
              name: args.name,
              slug: generateSlug(args.name),
              keepCurrentActiveOrganization: false
            },
            headers
          }),
        (a) => new DatabaseError(a)
      )
      if (!org) {
        return yield* new ServerError({
          message: "failed to create organization"
        })
      }

      yield* effectifyPromise(
        () => markAsActiveFn(ctx, { orgId: org?.id }),
        (a) => new ServerError(a)
      )
      return org
    })

    return await runEffOrThrow(appRuntime, program)
  })
  .public()

export const markAsActiveFn = mutation
  .input(z.object({ orgId: z.string() }))
  .handler(async (ctx, args) => {
    const program = Effect.gen(function* () {
      const { auth, headers } = yield* getUserAuth(ctx)
      const org = yield* effectifyPromise(
        async () =>
          auth.api.setActiveOrganization({
            body: {
              organizationId: args.orgId
            },
            headers
          }),
        (a) => new DatabaseError(a)
      )
      return org
    })

    return await runEffOrThrow(appRuntime, program)
  })

export const markAsActive = markAsActiveFn.public()
