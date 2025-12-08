import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { tryCatch } from "@/lib/utils"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
})

export function SignIn() {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Button
        onClick={async () => {
          setIsPending(true)
          const [, err] = await tryCatch(
            authClient.signIn.social({
              provider: "github",
            }),
          )

          if (err) {
            console.error("Failed to sign in - ", err)
            return
          }

          await router.invalidate()
          await router.navigate({ to: "/" })
          setIsPending(false)
        }}
      >
        {isPending && <Spinner />}
        {"Sign in with Github"}
      </Button>
    </div>
  )
}
