"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/style-utils"

/**
 * RadioGroup component for groups of radio inputs
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - RadioGroup items
 * @returns {JSX.Element} RadioGroup component
 */
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = "RadioGroup"

/**
 * RadioGroupItem component for individual radio inputs
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes for the root element
 * @param {string} props.indicatorClassName - Additional CSS classes for the indicator
 * @param {string} props.size - Size variant (sm, default, lg)
 * @returns {JSX.Element} RadioGroupItem component
 */
const RadioGroupItem = React.forwardRef(({ 
  className, 
  indicatorClassName,
  size = "default",
  ...props 
}, ref) => {
  // Size variants
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-5 w-5",
  };

  // Indicator size variants
  const indicatorSizeClasses = {
    sm: "h-1.5 w-1.5",
    default: "h-2 w-2",
    lg: "h-2.5 w-2.5",
  };

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className={cn(
          "rounded-full bg-current",
          indicatorSizeClasses[size] || indicatorSizeClasses.default,
          indicatorClassName
        )} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
