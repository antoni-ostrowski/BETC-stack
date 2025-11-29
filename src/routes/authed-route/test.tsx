import { createFileRoute, useLoaderData } from "@tanstack/react-router"

export const Route = createFileRoute("/authed-route/test")({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useLoaderData({ from: "/authed-route" })
  return <div>Hello authednticated user, thats your id - {user._id} </div>
}
