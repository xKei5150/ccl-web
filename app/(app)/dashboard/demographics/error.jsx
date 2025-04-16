'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="max-w-md w-full border-red-200">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-2">
            An error occurred while loading demographic data.
          </p>
          <p className="text-sm text-red-500 bg-red-50 p-2 rounded break-words max-h-24 overflow-auto">
            {error.message || "Unknown error"}
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => reset()}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 