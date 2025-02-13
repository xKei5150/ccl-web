import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">Post Not Found</h2>
      <p className="text-muted-foreground">
        The post you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/dashboard/posts">Return to Posts</Link>
      </Button>
    </div>
  );
}