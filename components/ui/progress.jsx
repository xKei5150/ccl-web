"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/style-utils"

/**
 * Progress component for displaying progress bars
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.value - Progress value (0-100)
 * @param {string} props.size - Size variant (sm, default, lg)
 * @param {string} props.variant - Progress variant (default, primary, success, destructive)
 * @returns {JSX.Element} Progress component
 */
const Progress = React.forwardRef(({ 
  className, 
  value, 
  size = "default",
  variant = "default",
  ...props 
}, ref) => {
  // Size variants
  const sizeClasses = {
    sm: "h-2",
    default: "h-4",
    lg: "h-6",
    xl: "h-8",
  };

  // Indicator color variants
  const variantClasses = {
    default: "bg-primary",
    primary: "bg-primary",
    success: "bg-success",
    destructive: "bg-destructive",
    secondary: "bg-secondary-foreground",
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-secondary", 
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all", 
          variantClasses[variant] || variantClasses.default
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = "Progress"

/**
 * Progress label component
 */
const ProgressLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-1 text-sm font-medium", className)}
    {...props}
  />
))
ProgressLabel.displayName = "ProgressLabel"

/**
 * Progress indicator component
 */
const ProgressIndicator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ml-2 text-sm text-muted-foreground", className)}
    {...props}
  />
))
ProgressIndicator.displayName = "ProgressIndicator"

/**
 * Progress container component with label and value indicator
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.label - Progress label
 * @param {number} props.value - Progress value (0-100)
 * @param {boolean} props.showValue - Whether to show the value indicator
 * @param {React.ReactNode} props.children - Progress element
 * @returns {JSX.Element} ProgressContainer component
 */
const ProgressContainer = ({
  className,
  label,
  value,
  showValue = true,
  children,
  ...props
}) => (
  <div className={cn("space-y-1.5", className)} {...props}>
    {label && (
      <div className="flex items-center justify-between">
        <ProgressLabel>{label}</ProgressLabel>
        {showValue && <ProgressIndicator>{value || 0}%</ProgressIndicator>}
      </div>
    )}
    {children}
  </div>
)
ProgressContainer.displayName = "ProgressContainer"

export { Progress, ProgressLabel, ProgressIndicator, ProgressContainer }
