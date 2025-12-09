import { authClient } from "@/lib/auth-client"
import { fetchQuery } from "@/lib/auth-server"
import { tryCatch } from "@/lib/utils"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import { api } from "../../../convex/_generated/api"

const getAuth = createIsomorphicFn()
  .server(async () => {
    const [data, err] = await tryCatch(
      fetchQuery(api.user.queries.getCurrentUser, {}),
    )
    console.log({ data })
    console.log({ err })
    if (err) {
      throw new Error("User not found")
    }
    return data._id
  })
  .client(async () => {
    const session = await authClient.getSession()
    if (session.error) {
      throw session.error
    }
    if (!session.data?.user) {
      throw new Error("User not found")
    }
    return session.data.user.id
  })

export const Route = createFileRoute("/authed-route")({
  // main auth check for this and child routes,
  // you can of course check that per route too
  beforeLoad: async ({ context: { token, userId } }) => {
    // those are undefined in logs
    console.log({ token })
    console.log({ userId })
    // const auth = await getAuth()
    // console.log({ auth })
    // const auth = authClient.getSessionData()
    // console.log("in authed layout - ", auth)
    // ensureAuthedOrRedirect(auth.data?.session)
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
