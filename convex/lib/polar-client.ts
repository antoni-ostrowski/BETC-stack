import { Polar } from "@polar-sh/sdk"

export const getPolarClient = () =>
  new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!, // oxlint-disable-line
    server: process.env.POLAR_SERVER === "production" ? "production" : "sandbox"
  })
