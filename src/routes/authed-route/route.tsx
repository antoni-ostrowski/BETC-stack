import { ensureAuthedOrRedirect } from "@/lib/utils"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/authed-route")({
  // main auth check for this and child routes
  beforeLoad: ({ context: { user } }) => {
    ensureAuthedOrRedirect(user)
  },
  // ensure user is authed here so all the child routes
  // can hook up to this loader data and use user data
  loader: ({ context: { user, token, userId } }) => {
    ensureAuthedOrRedirect(user)
    return {
      user,
      token,
      userId,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-screen w-screen">
      <Outlet />
    </div>
  )
}
