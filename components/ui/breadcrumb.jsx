import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/style-utils"

/**
 * Breadcrumb component for navigation paths
 */
const Breadcrumb = React.forwardRef(
  ({ className, ...props }, ref) => (
    <nav 
      ref={ref} 
      aria-label="breadcrumb"
      className={cn("mx-auto w-full", className)}
      {...props} 
    />
  )
)
Breadcrumb.displayName = "Breadcrumb"

/**
 * BreadcrumbList component for container of breadcrumb items
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size variant (sm, default, lg)
 * @returns {JSX.Element} BreadcrumbList component
 */
const BreadcrumbList = React.forwardRef(({ 
  className, 
  size = "default",
  ...props 
}, ref) => {
  // Size variants
  const sizeClasses = {
    sm: "text-xs gap-1",
    default: "text-sm gap-1.5 sm:gap-2.5",
    lg: "text-base gap-2 sm:gap-3",
  };
  
  return (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center break-words text-muted-foreground",
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
    />
  )
})
BreadcrumbList.displayName = "BreadcrumbList"

/**
 * BreadcrumbItem component for individual items
 */
const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

/**
 * BreadcrumbLink component for clickable breadcrumb links
 * 
 * @param {object} props - Component properties
 * @param {boolean} props.asChild - Whether to render as a child component
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Visual variant (default, muted, hover)
 * @returns {JSX.Element} BreadcrumbLink component
 */
const BreadcrumbLink = React.forwardRef(({ 
  asChild, 
  className, 
  variant = "default",
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "a"
  
  // Variant styles
  const variantClasses = {
    default: "transition-colors hover:text-foreground",
    muted: "text-muted-foreground hover:text-foreground",
    hover: "hover:underline hover:text-foreground",
  };

  return (
    <Comp
      ref={ref}
      className={cn(
        variantClasses[variant] || variantClasses.default,
        className
      )}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

/**
 * BreadcrumbPage component for current page (non-clickable)
 */
const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

/**
 * BreadcrumbSeparator component for separators between items
 * 
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Custom separator content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} BreadcrumbSeparator component
 */
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight className="size-3.5" />}
  </span>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

/**
 * BreadcrumbEllipsis component for collapsed breadcrumbs
 */
const BreadcrumbEllipsis = ({
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
