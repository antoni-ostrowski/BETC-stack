import { setupFetchClient } from "@convex-dev/better-auth/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { createAuth } from "../../convex/auth"

// those are necessary utils to fetch convex functions from tanstack server code
export const { fetchQuery, fetchMutation, fetchAction } =
  await setupFetchClient(createAuth, getCookie)
