"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import TipTap editor with SSR disabled
const Tiptap = dynamic(() => import("@/components/ui/tiptap"), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-[300px] w-full rounded-md border" />
  ),
});

export default function RichTextEditor({ content, onChange, disabled }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="h-[300px] w-full rounded-md border" />;
  }

  return (
    <div className="relative min-h-[300px] w-full rounded-md border">
      <Tiptap
        content={content}
        onChange={onChange}
        disabled={disabled}
        editable={!disabled}
      />
    </div>
  );
}