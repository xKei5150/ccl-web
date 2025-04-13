import * as React from "react"
import { cn } from "@/lib/style-utils"

/**
 * Heading component with multiple variants
 */
const Heading = React.forwardRef(({ 
  className, 
  variant = "h1", 
  children,
  ...props 
}, ref) => {
  const variantStyles = {
    h1: "text-3xl font-bold tracking-tight md:text-4xl",
    h2: "text-2xl font-semibold tracking-tight md:text-3xl",
    h3: "text-xl font-semibold tracking-tight md:text-2xl",
    h4: "text-lg font-semibold tracking-tight md:text-xl",
    h5: "text-base font-semibold tracking-tight md:text-lg",
    h6: "text-sm font-semibold tracking-tight md:text-base",
  }

  const Component = variant

  return (
    <Component
      ref={ref}
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  )
})

Heading.displayName = "Heading"

export { Heading } 