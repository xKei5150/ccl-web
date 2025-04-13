"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/style-utils"

/**
 * Drawer component for sliding panels
 */
const Drawer = ({
  shouldScaleBackground = true,
  ...props
}) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

/**
 * Drawer overlay component
 */
const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
DrawerOverlay.displayName = "DrawerOverlay"

/**
 * Drawer content component with size and position variants
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Drawer content
 * @param {string} props.size - Size variant (sm, default, lg, xl, full)
 * @param {string} props.position - Position (bottom, top, left, right)
 * @returns {JSX.Element} DrawerContent component
 */
const DrawerContent = React.forwardRef(({ 
  className, 
  children, 
  size = "default",
  position = "bottom",
  ...props 
}, ref) => {
  // Size variants based on position
  const sizeClasses = {
    // Bottom and top position sizes (height)
    bottom: {
      sm: "h-1/4",
      default: "h-2/5",
      lg: "h-1/2",
      xl: "h-2/3",
      full: "h-screen",
    },
    top: {
      sm: "h-1/4",
      default: "h-2/5",
      lg: "h-1/2",
      xl: "h-2/3",
      full: "h-screen",
    },
    // Left and right position sizes (width)
    left: {
      sm: "w-1/4",
      default: "w-80",
      lg: "w-96",
      xl: "w-1/3",
      full: "w-screen",
    },
    right: {
      sm: "w-1/4",
      default: "w-80",
      lg: "w-96",
      xl: "w-1/3",
      full: "w-screen",
    },
  };

  // Position styles
  const positionClasses = {
    bottom: "inset-x-0 bottom-0 rounded-t-[10px] border-t",
    top: "inset-x-0 top-0 rounded-b-[10px] border-b",
    left: "inset-y-0 left-0 h-full rounded-r-[10px] border-r",
    right: "inset-y-0 right-0 h-full rounded-l-[10px] border-l",
  };

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col bg-background",
          positionClasses[position] || positionClasses.bottom,
          position === "bottom" || position === "top" 
            ? sizeClasses[position][size] || sizeClasses[position].default
            : sizeClasses[position][size] || sizeClasses[position].default,
          className
        )}
        {...props}
      >
        {position === "bottom" && (
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        )}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
})
DrawerContent.displayName = "DrawerContent"

/**
 * Drawer header component
 */
const DrawerHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

/**
 * Drawer footer component
 */
const DrawerFooter = ({
  className,
  ...props
}) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

/**
 * Drawer title component
 */
const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DrawerTitle.displayName = "DrawerTitle"

/**
 * Drawer description component
 */
const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = "DrawerDescription"

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
