import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/todos")({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/sign-in" })
    }
  },
  component: RouteComponent
})

function RouteComponent() {
  return <>todo</>
}
