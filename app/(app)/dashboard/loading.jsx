"use client";

import { Loading } from "@/components/ui/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid } from "@/components/layout/grid";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Skeleton for dashboard title */}
      <div className="animate-pulse flex flex-col gap-2">
        <div className="h-8 bg-muted rounded-md w-1/4"></div>
        <div className="h-4 bg-muted rounded-md w-2/5"></div>
      </div>
      
      {/* Stats cards */}
      <Grid mobile={1} tablet={2} desktop={4}>
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>
                <div className="h-5 bg-muted rounded-md w-3/5 animate-pulse"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-2">
                <div className="h-7 bg-muted rounded-md w-1/4"></div>
                <div className="h-4 bg-muted rounded-md w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </Grid>
      
      {/* Main content */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-5 bg-muted rounded-md w-1/3 animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Loading variant="skeleton" className="p-4" />
        </CardContent>
      </Card>
    </div>
  );
} 