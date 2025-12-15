import { ensureAuthDataOrThrow } from "@/lib/auth-client"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/authed-route")({
  beforeLoad: async (ctx) => {
    // this invocation ensures only signed in user can access this route,
    // and all of the child routes
    await ensureAuthDataOrThrow(
      ctx.context.queryClient,
      ctx.context.convexQueryClient
    )
  },
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="h-screen w-screen">
      <Outlet />
    </div>
  )
}
