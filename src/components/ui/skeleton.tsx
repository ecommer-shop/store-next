import { cn } from "@/lib/vendure/shared/utils"
import {Skeleton as SkeletonPrimitive} from "@heroui/react" 

function Skeleton({ className, ...props }: React.ComponentProps<typeof SkeletonPrimitive>) {
  return (
    <SkeletonPrimitive
      data-slot="skeleton"
      className={cn("bg-surface-quaternary animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
