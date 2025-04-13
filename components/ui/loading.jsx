import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/style-utils';

/**
 * Loading component with different variants
 * 
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Loading display variant (spinner, card, skeleton, dots)
 * @param {string} props.size - Size variant (sm, default, lg)
 * @param {string} props.text - Optional text to display
 * @returns {JSX.Element} Loading component
 */
export function Loading({ 
  className, 
  variant = "spinner", 
  size = "default",
  text = "Loading..." 
}) {
  // Size variants
  const sizeClasses = {
    sm: {
      container: "p-2",
      spinner: "h-4 w-4",
      text: "text-xs"
    },
    default: {
      container: "p-4",
      spinner: "h-6 w-6",
      text: "text-sm"
    },
    lg: {
      container: "p-6",
      spinner: "h-10 w-10",
      text: "text-base"
    }
  };
  
  const currentSize = sizeClasses[size] || sizeClasses.default;
  
  // Spinner variant
  if (variant === "spinner") {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center gap-2",
        currentSize.container,
        className
      )}>
        <Loader2 className={cn("animate-spin text-primary", currentSize.spinner)} />
        {text && <p className={cn("text-muted-foreground", currentSize.text)}>{text}</p>}
      </div>
    );
  }
  
  // Card loading variant with skeleton
  if (variant === "card") {
    return (
      <div className={cn(
        "rounded-lg border bg-card shadow-sm p-4 animate-pulse",
        className
      )}>
        <div className="space-y-3">
          <div className="h-2.5 bg-muted rounded-full w-3/4"></div>
          <div className="h-2 bg-muted rounded-full w-11/12"></div>
          <div className="h-2 bg-muted rounded-full w-4/6"></div>
          <div className="h-2 bg-muted rounded-full w-5/6"></div>
        </div>
      </div>
    );
  }
  
  // Skeleton loading variant
  if (variant === "skeleton") {
    return (
      <div className={cn(
        "animate-pulse space-y-2 w-full",
        className
      )}>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded-full w-3/4"></div>
            <div className="h-3 bg-muted rounded-full w-1/2"></div>
          </div>
        </div>
        <div className="h-3 bg-muted rounded-full w-full"></div>
        <div className="h-3 bg-muted rounded-full w-11/12"></div>
        <div className="h-3 bg-muted rounded-full w-4/5"></div>
      </div>
    );
  }
  
  // Dots loading variant
  if (variant === "dots") {
    return (
      <div className={cn(
        "flex items-center justify-center gap-1",
        currentSize.container,
        className
      )}>
        <div className="flex space-x-1">
          {[1, 2, 3].map((dot) => (
            <div 
              key={dot}
              className={cn(
                "rounded-full bg-primary animate-bounce",
                currentSize.spinner === "h-4 w-4" ? "h-1.5 w-1.5" : 
                currentSize.spinner === "h-6 w-6" ? "h-2 w-2" : "h-3 w-3"
              )}
              style={{ 
                animationDelay: `${(dot - 1) * 0.1}s`,
                animationDuration: "0.6s" 
              }}
            />
          ))}
        </div>
        {text && <p className={cn("text-muted-foreground ml-2", currentSize.text)}>{text}</p>}
      </div>
    );
  }
  
  // Default fallback
  return (
    <div className={cn(
      "w-full flex justify-center items-center p-4 text-center",
      className
    )}>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
} 