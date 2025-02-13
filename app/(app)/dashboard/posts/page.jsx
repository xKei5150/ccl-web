import { PostLayout } from "@/components/posts/PostLayout";
import { WelcomeMessage } from "@/components/posts/WelcomeMessage";
import { getPostsAction } from "./actions";

export const metadata = {
  title: "Posts | Dashboard",
  description: "Manage your posts",
};

export default async function PostsPage() {
  const { docs: posts } = await getPostsAction();
  
  return (
    <PostLayout posts={posts}>
      <WelcomeMessage />
    </PostLayout>
  );
}