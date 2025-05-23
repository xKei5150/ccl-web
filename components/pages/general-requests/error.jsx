"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GeneralRequestError({
  error,
  reset,
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>There was an error loading the request data. Please try again.</p>
        <Button
          variant="outline"
          onClick={reset}
          className="w-fit gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}