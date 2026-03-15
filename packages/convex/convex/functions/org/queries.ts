import { Effect } from "effect"
import z from "zod"

import { ServerError } from "../errors"
import { authedQuery } from "../lib"
import { appRuntime } from "../runtime"
import { effectifyPromise, getUserById, runEffOrThrow } from "../utils_effect"

export const checkUserMembership = authedQuery
  .input(z.object({ slug: z.string() }))
  .handler(async (ctx, args) => {
    const program = Effect.gen(function* () {
      const org = yield* effectifyPromise(() =>
        ctx.db
          .query("organization")
          .withIndex("slug", (q) => q.eq("slug", args.slug))
          .first()
      )
      if (!org) {
        return yield* new ServerError({ message: "organization doesnt exist" })
      }
      const userMempership = yield* effectifyPromise(() =>
        ctx.db
          .query("member")
          .withIndex("userId_organization_id", (q) =>
            q.eq("userId", ctx.userId).eq("organizationId", org._id)
          )
          .first()
      )
      if (!userMempership) {
        return yield new ServerError({ message: "you are not part of this org" })
      }

      return userMempership
    })

    return runEffOrThrow(appRuntime, program)
  })
  .public()

export const getPersonalOrg = authedQuery
  .handler(async (ctx) => {
    const program = Effect.gen(function* () {
      const personalOrgId = (yield* getUserById(ctx, ctx.userId)).personalOrganizationId
      if (!personalOrgId) {
        return null
      }
      const org = yield* effectifyPromise(() => ctx.db.get(personalOrgId))
      return org
    })
    return await runEffOrThrow(appRuntime, program)
  })
  .public()
