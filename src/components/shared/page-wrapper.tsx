import { cn } from "@/lib/utils"
import { ComponentProps, ReactNode } from "react"

export default function PageWrapper({
  children,
  className,
}: {
  children: ReactNode
  className?: ComponentProps<"div">
}) {
  return (
    <div
      className={cn(
        "flex-1 flex justify-start items-start flex-col",
        className,
      )}
    >
      {children}
    </div>
  )
}
