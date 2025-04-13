import { Skeleton } from "@/components/ui/skeleton";

export function SearchSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[180px] rounded-md" />
          <Skeleton className="h-10 w-[180px] rounded-md" />
        </div>
      </div>
    </div>
  );
} 