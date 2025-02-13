"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export function EditFormError({ error, reset, slug }) {
  return (
    <Card className="mx-auto max-w-md p-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <h2 className="text-lg font-semibold">Failed to load editor</h2>
        <p className="text-sm text-muted-foreground">
          {error?.message || "There was an error loading the post editor."}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Button asChild>
            <Link href={`/dashboard/posts/${slug}`}>Back to Post</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}