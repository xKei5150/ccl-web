"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { cn } from "@/lib/style-utils";

/**
 * Error fallback component for error boundaries
 * 
 * @param {object} props - Component properties
 * @param {Error} props.error - The error that was caught
 * @param {function} props.reset - Function to reset the error boundary
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Error display variant (default, inline, minimal)
 */
export function ErrorFallback({ 
  error, 
  reset,
  className,
  variant = "default"
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error caught by error boundary:", error);
  }, [error]);

  // Different layout variants
  if (variant === "inline") {
    return (
      <div className={cn(
        "w-full rounded-md border border-destructive/50 bg-destructive/10 p-4",
        className
      )}>
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-destructive">Something went wrong</h3>
            <p className="text-sm text-destructive/80 mt-1">
              {error?.message || "An unexpected error occurred"}
            </p>
            <Button 
              variant="destructive" 
              size="sm" 
              className="mt-2" 
              onClick={reset}
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn(
        "flex items-center justify-center p-4 text-center",
        className
      )}>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {error?.message || "An unexpected error occurred"}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={reset}
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  // Default full-page error
  return (
    <div className={cn(
      "flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-center",
      className
    )}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl font-bold text-destructive">Something went wrong!</h2>
        <p className="max-w-md text-muted-foreground">
          {error?.message || "An unexpected error occurred"}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
        
        <Button 
          onClick={reset} 
          variant="default"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        
        <Button 
          variant="secondary" 
          asChild
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * Global error component for app/error.js
 */
export function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="fixed inset-0 flex items-center justify-center bg-background">
          <ErrorFallback error={error} reset={reset} />
        </div>
      </body>
    </html>
  );
}
