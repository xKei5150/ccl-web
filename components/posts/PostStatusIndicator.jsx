"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function PostStatusIndicator({ status, isLoading }) {
  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            status === "published" && "bg-green-500",
            status === "draft" && "bg-yellow-500"
          )}
        />
      )}
      <span className="text-sm text-muted-foreground capitalize">
        {isLoading ? "Saving..." : status}
      </span>
    </div>
  );
}