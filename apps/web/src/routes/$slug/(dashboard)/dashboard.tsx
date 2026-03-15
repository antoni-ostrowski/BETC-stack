import { authClient } from "@/lib/auth-client"
import { tryCatch } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "@packages/convex"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/(dashboard)/dashboard")({
  beforeLoad: async ({ context, params }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/sign-in" })
    }
    const [_isUserPartOfThisOrg, err] = await tryCatch(
      context.queryClient.fetchQuery(
        convexQuery(api.org.queries.checkUserMembership, { slug: params.slug })
      )
    )
    if (err) {
      throw redirect({ to: "/" })
    }
    await tryCatch(authClient.organization.setActive({ organizationSlug: params.slug }))
  },
  component: RouteComponent
})

function RouteComponent() {
  return <Outlet />
}
