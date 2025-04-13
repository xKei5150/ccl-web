"use client";
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva } from "class-variance-authority";
import { X } from "lucide-react"

import { cn } from "@/lib/style-utils"

/**
 * Toast provider component
 */
const ToastProvider = ToastPrimitives.Provider

/**
 * Toast viewport component that positions toasts
 */
const ToastViewport = React.forwardRef(({ 
  className,
  position = "bottom-right", 
  ...props 
}, ref) => {
  // Position variants
  const positionClasses = {
    "top-right": "top-0 right-0 flex-col-reverse",
    "top-left": "top-0 left-0 flex-col-reverse",
    "bottom-right": "bottom-0 right-0 flex-col",
    "bottom-left": "bottom-0 left-0 flex-col",
    "top-center": "top-0 left-1/2 -translate-x-1/2 flex-col-reverse",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 flex-col",
  };

  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        "fixed z-[100] flex max-h-screen w-full p-4 md:max-w-[420px]",
        positionClasses[position] || positionClasses["bottom-right"],
        className
      )}
      {...props}
    />
  )
})
ToastViewport.displayName = "ToastViewport"

/**
 * Toast variants
 */
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground",
        success: "border-success bg-success text-success-foreground",
        warning: "border-amber-600 bg-amber-500 text-white",
        info: "border-blue-600 bg-blue-500 text-white",
      },
      size: {
        default: "p-4",
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
 * Toast component
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Toast variant (default, destructive, success, warning, info)
 * @param {string} props.size - Toast size (sm, default, lg)
 * @returns {JSX.Element} Toast component
 */
const Toast = React.forwardRef(({ 
  className, 
  variant, 
  size,
  ...props 
}, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant, size }), className)}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

/**
 * Toast action component
 */
const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = "ToastAction"

/**
 * Toast close button component
 */
const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = "ToastClose"

/**
 * Toast title component
 */
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title 
    ref={ref} 
    className={cn("text-sm font-semibold", className)} 
    {...props} 
  />
))
ToastTitle.displayName = "ToastTitle"

/**
 * Toast description component
 */
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description 
    ref={ref} 
    className={cn("text-sm opacity-90", className)} 
    {...props} 
  />
))
ToastDescription.displayName = "ToastDescription"

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction };
