import { Suspense } from "react";
import { PostForm } from "@/components/posts/PostForm";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";

export const metadata = {
  title: "New Post | Dashboard",
  description: "Create a new post",
};

export default function NewPostPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PostForm />
    </Suspense>
  );
}