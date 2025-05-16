'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in flex items-center justify-center">
      <Card className="w-[420px] border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 bg-red-50 text-red-600 p-2 rounded-full w-12 h-12 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
          <CardDescription>
            We encountered an error while loading financing records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={reset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 