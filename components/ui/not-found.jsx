"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileQuestion } from "lucide-react";

export function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <FileQuestion className="h-24 w-24 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-6">Page not found</p>
      <Button onClick={() => router.push(-1)}>Go Back</Button>
    </div>
  );
}