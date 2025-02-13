import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function StatsSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
          <Skeleton className="h-5 w-72" />
        </CardHeader>
        <CardContent className="px-0">
          <Skeleton className="h-[300px] w-full mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsSkeleton />
            <StatsSkeleton />
            <StatsSkeleton />
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-5 w-64" />
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}