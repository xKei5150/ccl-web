"use client";

import { useEffect } from "react";
import { Button } from "./button";

export function ErrorFallback({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold text-destructive">Something went wrong!</h2>
        <p className="text-sm text-muted-foreground">
          {error?.message || "An unexpected error occurred"}
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
