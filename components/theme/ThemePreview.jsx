"use client";

import { Suspense } from "react";
import { useTheme } from "@/hooks/use-theme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

function PreviewContent() {
  const { theme } = useTheme();

  return (
    <div className="space-y-4">
      <Card style={{ backgroundColor: theme.card }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm" style={{ color: theme.cardForeground }}>
            Theme Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}>
              Primary
            </Button>
            <Button variant="secondary" style={{ backgroundColor: theme.secondary, color: theme.secondaryForeground }}>
              Secondary
            </Button>
            <Button variant="destructive" style={{ backgroundColor: theme.destructive, color: theme.destructiveForeground }}>
              Destructive
            </Button>
          </div>

          {/* Background Samples */}
          <div className="grid grid-cols-2 gap-2">
            <div style={{ backgroundColor: theme.muted }} className="p-2 rounded-md">
              <span style={{ color: theme.mutedForeground }}>Muted</span>
            </div>
            <div style={{ backgroundColor: theme.accent }} className="p-2 rounded-md">
              <span style={{ color: theme.accentForeground }}>Accent</span>
            </div>
          </div>

          {/* Sidebar Preview */}
          <div className="rounded-md overflow-hidden border" style={{ borderColor: theme.sidebarBorder }}>
            <div className="p-3" style={{ backgroundColor: theme.sidebarBackground }}>
              <span style={{ color: theme.sidebarForeground }}>Sidebar</span>
              <div className="mt-2 space-y-2">
                <div className="p-2 rounded" style={{ 
                  backgroundColor: theme.sidebarPrimary,
                  color: theme.sidebarPrimaryForeground
                }}>
                  Active Item
                </div>
                <div className="p-2 rounded" style={{ 
                  backgroundColor: theme.sidebarAccent,
                  color: theme.sidebarAccentForeground
                }}>
                  Hover Item
                </div>
              </div>
            </div>
          </div>

          {/* States Preview */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Badge variant="outline" style={{ borderColor: theme.border }}>
                Border
              </Badge>
              <Badge variant="outline" style={{ backgroundColor: theme.input }}>
                Input
              </Badge>
            </div>
            <input 
              type="text" 
              className="w-full p-2 rounded-md border"
              placeholder="Input Example"
              style={{ 
                backgroundColor: theme.background,
                color: theme.foreground,
                borderColor: theme.border
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <Skeleton className="h-32" />
        <div className="space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-10" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ThemePreview() {
  return (
    <Suspense fallback={<PreviewSkeleton />}>
      <PreviewContent />
    </Suspense>
  );
}