import { Effect, Schema } from "effect"
import z from "zod"

import { ServerError } from "../../errors"
import { effectifyPromise, getUserById } from "../../utils"
import { runEffOrThrow } from "../../utils"
import { authedQuery } from "../lib"
import { appRuntime } from "../runtime"

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
        return yield* new ServerError({ message: "organization doesnt exist", cause: null })
      }
      const userMempership = yield* effectifyPromise(() =>
        ctx.db
          .query("member")
          .withIndex("organization_id_userId", (q) =>
            q.eq("organizationId", org._id).eq("userId", ctx.userId)
          )
          .first()
      )
      if (!userMempership) {
        return yield new ServerError({ message: "you are not part of this org", cause: null })
      }

      return userMempership
    })

    return runEffOrThrow(appRuntime, program)
  })
  .public()

export const getOrgBySlug = authedQuery
  .input(z.object({ slug: z.string() }))
  .handler(
    async (ctx, args) =>
      await runEffOrThrow(
        appRuntime,
        Effect.gen(function* () {
          if (args.slug.length === 0) {
            return yield* new ServerError({ message: "no slug provided", cause: null })
          }
          const org = yield* effectifyPromise(() =>
            ctx.db
              .query("organization")
              .withIndex("slug", (q) => q.eq("slug", args.slug))
              .first()
          )
          return org
        })
      )
  )
  .public()

export const getPersonalOrg = authedQuery
  .handler(async (ctx) => {
    const program = Effect.gen(function* () {
      const personalOrgId = (yield* getUserById(ctx, ctx.userId)).personalOrganizationId
      if (!personalOrgId) {
        return null
      }
      console.log({ personalOrgId })
      const org = yield* effectifyPromise(() => ctx.db.get(personalOrgId))
      console.log({ org })
      return org
    })
    return await runEffOrThrow(appRuntime, program)
  })
  .public()
