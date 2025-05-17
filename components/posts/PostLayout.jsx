"use client";

import { Suspense } from "react";
import { PostSidebarToggle } from "./PostSidebarToggle";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export function PostLayout({ posts, children }) {
  const { isAdmin, isStaff } = useAuth();
  const hasAdminAccess = isAdmin || isStaff;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <Suspense fallback={<LoadingSkeleton />}>
        <PostSidebarToggle posts={posts}>
          <div className="flex flex-1 flex-col">
            <div className="flex h-16 items-center justify-between border-b px-4 md:px-6">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>

              <div className="ml-auto">
                {hasAdminAccess && (
                  <Button asChild>
                    <Link href="/dashboard/posts/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Post
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </div>
          </div>
        </PostSidebarToggle>
      </Suspense>
    </div>
  );
}