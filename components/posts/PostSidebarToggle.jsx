"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Plus, Keyboard } from "lucide-react";
import Link from "next/link";
import { PostSidebar } from "./PostSidebar";
import { usePostShortcuts } from "@/hooks/usePostShortcuts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ShortcutsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2" title="Keyboard Shortcuts">
          <Keyboard className="h-4 w-4" />
          <span className="sr-only">Keyboard Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="text-sm font-medium">New Post</div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌃</span>N
            </kbd>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="text-sm font-medium">Toggle Sidebar</div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌃</span>B
            </kbd>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="text-sm font-medium">Save Changes</div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌃</span>S
            </kbd>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="text-sm font-medium">Preview Post</div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌃</span>P
            </kbd>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="text-sm font-medium">Publish Post</div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌃</span><span className="text-xs">⇧</span>P
            </kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PostSidebarToggle({ posts, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  usePostShortcuts({
    onToggleSidebar: toggleSidebar,
  });

  return (
    <>
      <PostSidebar 
        posts={posts} 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
      />
      
      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <ShortcutsDialog />
          </div>

          <div className="ml-auto">
            <Button asChild>
              <Link href="/dashboard/posts/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}