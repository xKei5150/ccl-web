import * as React from "react"

import { cn } from "@/lib/style-utils"

/**
 * Textarea component with size variants
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size variant (sm, default, lg)
 * @param {string} props.variant - Visual variant (default, outline, ghost)
 * @returns {JSX.Element} Textarea component
 */
const Textarea = React.forwardRef(({ 
  className, 
  size = "default",
  variant = "default",
  ...props 
}, ref) => {
  // Size variants
  const sizeClasses = {
    sm: "px-3 py-1 text-xs min-h-[60px]",
    default: "px-3 py-2 text-sm min-h-[80px]",
    lg: "px-4 py-3 text-base min-h-[100px]",
  };

  // Visual variants  
  const variantClasses = {
    default: "border-input bg-background",
    outline: "border-2 border-input bg-transparent",
    ghost: "border-0 bg-transparent shadow-none",
  };

  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size] || sizeClasses.default,
        variantClasses[variant] || variantClasses.default,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
