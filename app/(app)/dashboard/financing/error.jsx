'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Card className="w-[420px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
          <CardDescription>
            We encountered an error while loading financing records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={reset}>Try again</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 