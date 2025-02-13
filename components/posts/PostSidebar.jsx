"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export function PostSidebar({ posts, isOpen, onToggle }) {
  const pathname = usePathname();
  const params = useParams();
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 76, // Approximate height of each post item
    overscan: 5,
  });

  return (
    <div className={cn(
      "border-r bg-sidebar transition-all duration-300 ease-in-out",
      isOpen ? "w-80" : "w-0 -translate-x-full md:w-16 md:translate-x-0"
    )}>
      <div className="flex h-16 items-center justify-between px-4">
        <h2 className={cn("font-semibold", !isOpen && "md:hidden")}>
          Posts
        </h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggle}
          className="md:hidden"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            !isOpen && "rotate-180"
          )} />
        </Button>
      </div>
      
      <nav 
        ref={parentRef}
        className={cn(
          "h-[calc(100vh-4rem-64px)] overflow-auto",
          !isOpen && "md:hidden"
        )}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const post = posts[virtualItem.index];
            return (
              <Link
                key={post.id}
                href={`/dashboard/posts/${post.slug}`}
                className={cn(
                  "absolute left-0 top-0 flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                  pathname === `/dashboard/posts/${post.slug}` && "bg-accent"
                )}
                style={{
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="font-medium line-clamp-1">{post.title}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="line-clamp-1">{post.author?.name}</span>
                  <span>•</span>
                  <span>{format(new Date(post.publishedDate), "MMM d, yyyy")}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}