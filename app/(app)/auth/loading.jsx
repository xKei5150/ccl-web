"use client";

import { Loading } from "@/components/ui/loading";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLoading() {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-6 py-8">
          {/* Logo placeholder */}
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse"></div>
          
          {/* Title placeholder */}
          <div className="space-y-2 text-center">
            <div className="h-6 w-32 bg-muted rounded-md animate-pulse mx-auto"></div>
            <div className="h-4 w-48 bg-muted rounded-md animate-pulse mx-auto"></div>
          </div>
          
          {/* Form fields */}
          <div className="w-full space-y-4">
            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
            <div className="h-10 bg-primary/30 rounded-md animate-pulse"></div>
          </div>
          
          {/* Loading spinner */}
          <Loading variant="dots" size="sm" text="Loading" />
        </div>
      </CardContent>
    </Card>
  );
} 