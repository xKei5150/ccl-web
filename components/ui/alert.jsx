import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/style-utils"

/**
 * Alert component variants
 */
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-success/50 text-success dark:border-success [&>svg]:text-success",
        warning:
          "border-amber-500/50 text-amber-600 dark:border-amber-500 [&>svg]:text-amber-600",
        info:
          "border-blue-500/50 text-blue-600 dark:border-blue-500 [&>svg]:text-blue-600",
      },
      size: {
        default: "p-4 text-sm",
        sm: "p-3 text-xs",
        lg: "p-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Alert component for displaying important messages
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Alert variant (default, destructive, success, warning, info)
 * @param {string} props.size - Alert size (sm, default, lg)
 * @returns {JSX.Element} Alert component
 */
const Alert = React.forwardRef(({ 
  className, 
  variant, 
  size,
  ...props 
}, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant, size }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

/**
 * Alert title component
 */
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

/**
 * Alert description component
 */
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

/**
 * Alert icon container
 */
const AlertIcon = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mr-2 flex-shrink-0", className)}
    {...props}
  />
))
AlertIcon.displayName = "AlertIcon"

/**
 * Alert actions container
 */
const AlertActions = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-3 flex flex-wrap gap-2", className)}
    {...props}
  />
))
AlertActions.displayName = "AlertActions"

export { Alert, AlertTitle, AlertDescription, AlertIcon, AlertActions }
