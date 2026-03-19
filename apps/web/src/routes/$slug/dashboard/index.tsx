import PageWrapper from "@/components/page-wrapper"
import { useCurrentDashOrg } from "@/lib/auth-client"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/dashboard/")({
  component: RouteComponent
})

function RouteComponent() {
  const { data: org, error } = useCurrentDashOrg()
  if (error) {
    return <div>error:</div>
  }
  console.log({ org })
  console.log({ error })

  return <PageWrapper>hi, youre in {org?.name}</PageWrapper>
}
