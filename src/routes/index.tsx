import PageWrapper from "@/components/shared/page-wrapper"
import { useSession } from "@/lib/auth-client"
import { useCRPC } from "@/lib/convex/cprc"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: App
})

function App() {
  const { user } = useSession()

  const crpc = useCRPC()
  const { data } = useQuery(crpc.todo.q.list.queryOptions())
  return (
    <PageWrapper className="h-screen">
      <p>hello {user?.name}</p>
      <Link to="/todos">todods</Link>
    </PageWrapper>
  )
}
