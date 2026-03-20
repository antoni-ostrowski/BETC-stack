import PageWrapper from "@/components/page-wrapper"
import { useCurrentDashOrg } from "@/lib/auth-client"
import { parseQueryError } from "@packages/convex"
import { createFileRoute } from "@tanstack/react-router"
import { Match } from "effect"

import { getOrgBySlugErrorsTypes } from "../../../../../../packages/convex/convex/functions/org/queries"

export const Route = createFileRoute("/$slug/dashboard/")({
  component: RouteComponent
})

function RouteComponent() {
  const { data: org, error } = useCurrentDashOrg()
  if (error) {
    const errMess = parseQueryError<getOrgBySlugErrorsTypes>(error).pipe(
      Match.tag("DatabaseError", (e) => "database failed!! do something custom here"),
      Match.tag("ServerError", (_e) => "internal server error, do something else here"),
      Match.orElse(() => "unknown error (fallback, so we dont crash on client)")
    )
    return <div>error: {errMess},</div>
  }
  console.log({ org })

  return <PageWrapper>hi, youre in {org?.name}</PageWrapper>
}
