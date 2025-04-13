import * as React from "react"

import { cn } from "@/lib/style-utils"

/**
 * Input component variants and sizes
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Input size (default, sm, lg)
 * @param {string} props.type - Input type
 * @param {string} props.variant - Input variant (default, outline, ghost)
 * @returns {JSX.Element} Input component
 */
const Input = React.forwardRef(({ 
  className, 
  size = "default",
  type,
  variant = "default", 
  ...props 
}, ref) => {
  // Size variants
  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-5 py-3 text-base",
  };

  // Visual variants  
  const variantClasses = {
    default: "border-input bg-background",
    outline: "border-2 border-input bg-transparent",
    ghost: "border-0 bg-transparent shadow-none",
  };

  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-md border text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size] || sizeClasses.default,
        variantClasses[variant] || variantClasses.default,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
