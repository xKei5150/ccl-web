import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EditPostForm } from "@/components/posts/EditPostForm";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { getPost } from "../../actions";

export async function generateMetadata({ params }) {
    const { slug } = params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `Edit ${post.title} | Dashboard`,
    description: `Edit post: ${post.title}`,
  };
}

export default async function EditPostPage({ params }) {
    const { slug } = await params
  const post = await getPost(slug);
  
  if (!post) notFound();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EditPostForm post={post} slug={slug} />
    </Suspense>
  );
}