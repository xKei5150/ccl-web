import { Skeleton } from "@/components/ui/skeleton";
import { PostLayout } from "@/components/posts/PostLayout";

export default function Loading() {
  // Create dummy posts for the loading state
  const dummyPosts = Array(5).fill(null).map((_, i) => ({
    id: i,
    title: "",
    author: { name: "" },
    publishedDate: new Date().toISOString(),
    slug: String(i)
  }));

  return (
    <PostLayout posts={dummyPosts}>
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
        <div className="space-y-2 pt-6">
          {Array(3).fill(null).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </PostLayout>
  );
}