import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/authed-route")({
  beforeLoad: async ({ context: { token, userId } }) => {
    console.log({ token })
    console.log({ userId })
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
