"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/style-utils"

/**
 * Tabs container component
 */
const Tabs = TabsPrimitive.Root

/**
 * TabsList component variants
 */
const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-md text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted p-1",
        outline: "border border-input bg-transparent",
        pills: "bg-transparent gap-2",
        underline: "border-b border-input bg-transparent",
      },
      size: {
        default: "h-10",
        sm: "h-8 text-xs",
        lg: "h-12 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
)

/**
 * TabsList component for grouping tab triggers
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Visual variant
 * @param {string} props.size - Size variant
 * @param {boolean} props.fullWidth - Whether tabs should take full width
 * @returns {JSX.Element} TabsList component
 */
const TabsList = React.forwardRef(({ 
  className, 
  variant,
  size,
  fullWidth,
  ...props 
}, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      tabsListVariants({ variant, size, fullWidth }),
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

/**
 * TabsTrigger component variants
 */
const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        outline: "border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:text-foreground",
        pills: "rounded-full bg-muted hover:bg-muted/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        underline: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground",
      },
      size: {
        default: "px-3 py-1.5 text-sm",
        sm: "px-2 py-1 text-xs",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * TabsTrigger component for individual tab buttons
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Visual variant
 * @param {string} props.size - Size variant
 * @returns {JSX.Element} TabsTrigger component
 */
const TabsTrigger = React.forwardRef(({ 
  className, 
  variant,
  size,
  ...props 
}, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size }), className)}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

/**
 * TabsContent component variants
 */
const tabsContentVariants = cva(
  "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "mt-2",
        outline: "mt-3",
        pills: "mt-3",
        underline: "pt-3",
      },
      padding: {
        default: "",
        none: "p-0",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

/**
 * TabsContent component for tab content panels
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Visual variant
 * @param {string} props.padding - Padding size
 * @returns {JSX.Element} TabsContent component
 */
const TabsContent = React.forwardRef(({ 
  className, 
  variant,
  padding,
  ...props 
}, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant, padding }), className)}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
