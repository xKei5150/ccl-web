import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostLayout } from "@/components/posts/PostLayout";
import { PostView } from "@/components/posts/PostView";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { getPost, getPostsAction } from "../actions";

export async function generateMetadata({ params }) {
    const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `${post.title} | Dashboard`,
    description: `View post: ${post.title}`,
  };
}

export default async function PostPage({ params }) {
    const { slug } = await params;
  const [post, { docs: posts }] = await Promise.all([
    getPost(slug),
    getPostsAction()
  ]);

  if (!post) notFound();

  return (
    <PostLayout posts={posts}>
      <Suspense fallback={<LoadingSkeleton />}>
        <PostView post={post} />
      </Suspense>
    </PostLayout>
  );
}