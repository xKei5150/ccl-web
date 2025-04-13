"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/style-utils"

/**
 * Switch component with size variants
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes for the root element
 * @param {string} props.thumbClassName - Additional CSS classes for the thumb element
 * @param {string} props.size - Size variant (sm, default, lg)
 * @returns {JSX.Element} Switch component
 */
const Switch = React.forwardRef(({ 
  className, 
  thumbClassName,
  size = "default",
  ...props 
}, ref) => {
  // Size variants
  const sizeClasses = {
    sm: "h-5 w-9",
    default: "h-6 w-11",
    lg: "h-7 w-14",
  };

  // Thumb size and translation variants
  const thumbSizeClasses = {
    sm: "h-4 w-4 data-[state=checked]:translate-x-4",
    default: "h-5 w-5 data-[state=checked]:translate-x-5",
    lg: "h-6 w-6 data-[state=checked]:translate-x-7",
  };

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
          thumbSizeClasses[size] || thumbSizeClasses.default,
          thumbClassName
        )} 
      />
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = "Switch"

export { Switch }
