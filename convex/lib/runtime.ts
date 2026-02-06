import { Layer, ManagedRuntime } from "effect"
import { MyConvex } from "./convex-service"

const appLayer = Layer.mergeAll(MyConvex.Live)

export const appRuntime = ManagedRuntime.make(appLayer)
