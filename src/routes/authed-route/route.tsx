import { ensureAuthedOrRedirect } from "@/lib/utils"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/authed-route")({
  // main auth check for this and child routes
  beforeLoad: ({ context: { user } }) => {
    console.log({ user })
    ensureAuthedOrRedirect(user)
    console.log({ user })
  },
  // ensure user is authed here so all the child routes
  // can hook up to this loader data and use user obj
  loader: ({ context: { user } }) => {
    ensureAuthedOrRedirect(user)
    return { user }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello this is layout of authed route <Outlet />
    </div>
  )
}
