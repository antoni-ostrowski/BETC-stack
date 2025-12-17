import PageWrapper from "@/components/shared/page-wrapper"
import { useUser } from "@/lib/auth-client"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/authed-route/test")({
  beforeLoad: async (ctx) => {
    if (!ctx.context.isAuthenticated) {
      throw redirect({ to: "/sign-in" })
    }
  },
  component: RouteComponent
})

function RouteComponent() {
  const { user } = useUser()
  console.log({ user })

  return (
    <PageWrapper>
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">
          Hi {user?.authInfo.name}! ({user?.authInfo.email})
        </h1>
        <h1 className="text-2xl font-bold">
          You can access this page only when you are authenticated.
        </h1>

        <p className="text-muted-foreground">
          Try accessing this page manually with url when signed out.
        </p>
      </div>
    </PageWrapper>
  )
}
