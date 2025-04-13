"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/style-utils"

/**
 * Checkbox component with consistent styling
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes for the root element
 * @param {string} props.indicatorClassName - Additional CSS classes for the indicator element
 * @param {string} props.size - Size variant (sm, default, lg)
 * @returns {JSX.Element} Checkbox component
 */
const Checkbox = React.forwardRef(({ 
  className, 
  indicatorClassName,
  size = "default",
  ...props 
}, ref) => {
  // Size variants
  const sizeClasses = {
    sm: "h-3.5 w-3.5 [&>svg]:size-3",
    default: "h-4 w-4 [&>svg]:size-4",
    lg: "h-5 w-5 [&>svg]:size-4.5",
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current", indicatorClassName)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12l5 5 9-9" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
