import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "../../convex/lib"
import { api } from "../../convex/_generated/api"
export const Route = createFileRoute("/")({
  loader: async ({ context: { userId } }) => {
    return { userId }
  },
  component: App,
})

function App() {
  const a = Route.useLoaderData()
  const { data } = useQuery(api.todos.list)
  console.log({ data })
  return <div>app,user id {a.userId}</div>
}
