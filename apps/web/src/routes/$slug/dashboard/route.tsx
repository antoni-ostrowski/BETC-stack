import PageWrapper from "@/components/page-wrapper"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { tryCatch } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "@packages/convex"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { AppSidebar } from "./-sidebar/app-sidebar"

export const Route = createFileRoute("/$slug/dashboard")({
  loader: async ({ context, params }) => {
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
  component: RouteComponent,
  pendingComponent: () => (
    <PageWrapper className="h-screen">
      <Spinner />
    </PageWrapper>
  )
})

function RouteComponent() {
  const { slug } = Route.useParams()
  return (
    <SidebarProvider>
      <AppSidebar slug={slug} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
