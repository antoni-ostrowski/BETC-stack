import { createFileRoute } from "@tanstack/react-router"
export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    // const user = await queryClient.fetchQuery(convexQuery(api.todos.list, {}))
    return { user: context.user, userId: context.userId }
  },
  component: App,
})

function App() {
  const loaderData = Route.useLoaderData()
  console.log(loaderData)
  return <div>app,user id {loaderData.userId}</div>
}
