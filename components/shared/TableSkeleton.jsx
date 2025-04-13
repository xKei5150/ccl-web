import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ columns = 5, rows = 5 }) {
  return (
    <div className="space-y-4">
      {/* Table header */}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array(columns).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-md" />
        ))}
      </div>
      
      {/* Table rows */}
      {Array(rows).fill(0).map((_, i) => (
        <div 
          key={i} 
          className="grid gap-4" 
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array(columns).fill(0).map((_, j) => (
            <Skeleton key={j} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ))}
      
      {/* Pagination skeleton */}
      <div className="flex justify-center mt-4">
        <Skeleton className="h-10 w-64 mx-auto rounded-md" />
      </div>
    </div>
  );
} 