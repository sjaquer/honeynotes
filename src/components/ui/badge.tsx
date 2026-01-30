import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-crimson-soft",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-sm",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "text-foreground border-primary/30 hover:bg-primary/5",
        success:
          "border-transparent bg-green-500/90 text-white hover:bg-green-500",
        warning:
          "border-transparent bg-amber-500/90 text-white hover:bg-amber-500",
        premium:
          "border-transparent bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-honey-glow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
