import { Skeleton, SVGSkeleton } from "@/components/ui/skeleton";
import React from "react";

export default function LoadingSkeleton() {
  return (
    <React.Fragment>
      <div className="mt-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <SVGSkeleton className="text-yellow-500 w-[24px] h-[24px]" />
            <span>
              <Skeleton className="w-[96px] max-w-full" />
            </span>
          </div>
          <div className="space-y-4">
            <div className="p-4">
              <h4>
                <Skeleton className="w-[64px] max-w-full" />
              </h4>
              <div className="mt-2">
                <Skeleton className="w-full max-w-full" />
              </div>
            </div>
            <div className="p-4">
              <h4>
                <Skeleton className="w-[80px] max-w-full" />
              </h4>
              <div className="mt-2">
                <Skeleton className="w-full max-w-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4">
                <h4>
                  <Skeleton className="w-[96px] max-w-full" />
                </h4>
                <ul className="mt-2 space-y-2">
                  <li>
                    <Skeleton className="w-full max-w-full" />
                  </li>
                  <li>
                    <Skeleton className="w-full max-w-full" />
                  </li>
                  <li>
                    <Skeleton className="w-full max-w-full" />
                  </li>
                </ul>
              </div>
              <div className="p-4">
                <h4>
                  <Skeleton className="w-[120px] max-w-full" />
                </h4>
                <ul className="mt-2 space-y-2">
                  <li>
                    <Skeleton className="w-full max-w-full" />
                  </li>
                  <li>
                    <Skeleton className="w-full max-w-full" />
                  </li>
                  <li>
                    <Skeleton className="w-full max-w-full" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}