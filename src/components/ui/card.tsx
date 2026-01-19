import * as React from "react"
import { cn } from "@/lib/vendure/shared/utils"
import { 
  Card as HeroCard, 
  CardHeader as HeroCardHeader, 
  CardContent as HeroCardBody, 
  CardFooter as HeroCardFooter 
} from '@heroui/react'

// Componente principal de Card
function Card({ 
  className, 
  ...props 
}: React.ComponentProps<typeof HeroCard>) {
  return (
    <HeroCard
      className={cn(
        "border border-border bg-background",
        className
      )}
      {...props}
    />
  )
}

// Versión simplificada con composición automática
const CardHeader = HeroCardHeader
const CardContent = HeroCardBody
const CardFooter = HeroCardFooter

// Componentes de texto personalizados
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// CardAction como contenedor flexible
function CardAction({ 
  className, 
  align = "end",
  ...props 
}: React.ComponentProps<"div"> & { align?: "start" | "center" | "end" }) {
  return (
    <div
      className={cn(
        "flex",
        {
          "justify-start": align === "start",
          "justify-center": align === "center",
          "justify-end": align === "end",
        },
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}