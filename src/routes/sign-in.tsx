import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { tryCatch } from "@/lib/utils"
import { createFileRoute, useRouter } from "@tanstack/react-router"

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
})

export function SignIn() {
  const router = useRouter()
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <Button
        onClick={async () => {
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
        }}
      >
        Sign in with Github
      </Button>
    </div>
  )
}
