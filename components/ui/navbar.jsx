"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/style-utils"

/**
 * Navbar component variants
 */
const navbarVariants = cva(
  "w-full flex items-center border-b border-border bg-background z-10",
  {
    variants: {
      variant: {
        default: "border-b border-border",
        transparent: "border-transparent bg-transparent",
        solid: "border-border bg-card shadow-sm",
        floating: "rounded-lg border shadow-sm mx-auto",
      },
      position: {
        default: "relative",
        sticky: "sticky top-0",
        fixed: "fixed top-0 left-0 right-0",
      },
      size: {
        default: "h-16",
        sm: "h-14",
        lg: "h-20",
      },
      width: {
        default: "w-full",
        contained: "container mx-auto",
        full: "w-full px-4 md:px-6 lg:px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "default",
      size: "default",
      width: "default",
    },
  }
)

/**
 * Navbar component
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Navbar content
 * @param {string} props.variant - Navbar style variant
 * @param {string} props.position - Position style (default, sticky, fixed)
 * @param {string} props.size - Size variant
 * @param {string} props.width - Width variant
 * @returns {JSX.Element} Navbar component
 */
const Navbar = React.forwardRef(({ 
  className, 
  children, 
  variant, 
  position,
  size, 
  width,
  ...props 
}, ref) => (
  <nav
    ref={ref}
    className={cn(navbarVariants({ variant, position, size, width }), className)}
    role="navigation"
    {...props}
  >
    {children}
  </nav>
))
Navbar.displayName = "Navbar"

/**
 * NavbarBrand component for logo and branding
 */
const NavbarBrand = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center h-full mr-4", className)}
    {...props}
  />
))
NavbarBrand.displayName = "NavbarBrand"

/**
 * NavbarContent component for primary content sections
 */
const NavbarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center flex-1", className)}
    {...props}
  />
))
NavbarContent.displayName = "NavbarContent"

/**
 * NavbarItem component for individual navbar items
 */
const NavbarItem = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center px-2", className)}
    {...props}
  />
))
NavbarItem.displayName = "NavbarItem"

/**
 * NavbarStart component for left-aligned items
 */
const NavbarStart = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center mr-auto", className)}
    {...props}
  />
))
NavbarStart.displayName = "NavbarStart"

/**
 * NavbarCenter component for centered items
 */
const NavbarCenter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center", className)}
    {...props}
  />
))
NavbarCenter.displayName = "NavbarCenter"

/**
 * NavbarEnd component for right-aligned items
 */
const NavbarEnd = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center ml-auto", className)}
    {...props}
  />
))
NavbarEnd.displayName = "NavbarEnd"

/**
 * NavbarToggle component for mobile menu toggle
 */
const NavbarToggle = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden",
      "hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
      className
    )}
    {...props}
  />
))
NavbarToggle.displayName = "NavbarToggle"

export {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarStart,
  NavbarCenter,
  NavbarEnd,
  NavbarToggle,
} 