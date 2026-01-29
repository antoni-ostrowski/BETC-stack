import PageWrapper from "@/components/shared/page-wrapper"
import { Button } from "@/components/ui/button"
import { authClient, useSession } from "@/lib/auth-client"
import { useCRPC } from "@/lib/convex/cprc"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Authenticated } from "better-convex/react"

export const Route = createFileRoute("/")({
  component: App
})

function App() {
  const { user } = useSession()
  const crpc = useCRPC()
  const { data } = useQuery(crpc.organization.list.queryOptions())
  const activeOrg = authClient.useActiveOrganization()
  return (
    <PageWrapper className="h-screen">
      <p>hello {user?.name}</p>
      <Link to="/todos" className="underline">
        todos
      </Link>
      <Authenticated>
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold">your orgs</h1>
          {data?.organizations.map((org) => {
            return <div key={org.id}>{org.name}</div>
          })}
        </div>
        <div>
          <Button
            onClick={async () => {
              await authClient.checkout({
                slug: "pro",
                referenceId: activeOrg.data?.id
              })
            }}
          >
            buy sub
          </Button>
        </div>
      </Authenticated>
    </PageWrapper>
  )
}
