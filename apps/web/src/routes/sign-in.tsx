import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@packages/convex"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/sign-in")({
  component: AuthPage
})

function AuthPage() {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const { mutateAsync: createPersonalOrg } = useMutation({
    mutationFn: useConvexMutation(api.org.mutations.create)
  })
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Button
        disabled={isPending}
        onClick={async () => {
          setIsPending(true)
          await authClient.signIn.social(
            {
              provider: "github"
            },
            {
              onSuccess: async () => {
                console.log("sign in on success handler")

                console.log("attemping to run org creation")
                await createPersonalOrg({ name: "Personal" })

                console.log("after org creation")
                await router.invalidate()

                await router.navigate({ to: "/" })
              },
              onError: (err) => {
                console.error("Failed to sign in - ", err)
                return
              }
            }
          )

          setIsPending(false)
        }}
      >
        {isPending && <Spinner />}
        {"Sign in with Github"}
      </Button>
    </div>
  )
}
